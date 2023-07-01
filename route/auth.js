const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User')

require('dotenv').config()

const router = express.Router();


//REGISTER
router.post('/register', async (req, res) => {
  console.log('authorization process');
  try {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { username, email } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json('all feild are required')
    }

    const findUser = await User.findOne({ $or: [{ email }, { username }] });
    if (findUser) {
      // User is already registered
      return res.status(301).json({ message: 'Already a User' });
    } else {
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: 'Successfully registered' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});







//LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json('Wrong credentials!');
    }

    const originalPassword = await bcrypt.compare(req.body.password, user.password);
    if (!originalPassword) {
      return res.status(401).send('Wrong credentials!');
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ others, accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// Endpoint to check the current user
router.get('/current-user', async (req, res) => {
  console.log('i am the current user')
  try {

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Authorization token not found' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;
    console.log(decoded.id)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    res.json({ user });
  } catch (error) {
    console.error('Error checking current user:', error);
    res.status(500).json({ message: 'Error checking current user' });
  }
});




module.exports = router;