const express = require('express');
const multer = require('multer');
const path = require('path');
const mime = require('mime');
const mongoose = require('mongoose');
const BlogPost = require('../model/Blogpost');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([{ name: 'picture' }, { name: 'pdf' }]);

router.post('/blog-posts', upload, async (req, res) => {
  const { title, content, date, author } = req.body;
  const pictureFile = req.files['picture'] ? req.files['picture'][0] : null;

  try {
    const newBlogPost = new BlogPost({
      title,
      content,
      date,
      picture: pictureFile
        ? {
          filename: pictureFile.filename,
          mimetype: pictureFile.mimetype,
          path: pictureFile.path,
        }
        : null,
      author,
    });

    await newBlogPost.save();

    res.json({ message: 'Blog post created successfully' });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error creating blog post' });
  }
});

router.get('/blog-posts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
});

router.post('/blog-posts/:postId/thumbs-up', async (req, res) => {
  const { postId } = req.params;

  try {
    const blogPost = await BlogPost.findById(postId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blogPost.liked = !blogPost.liked;

    if (blogPost.liked) {
      blogPost.thumbsUp++;
    } else {
      blogPost.thumbsUp--;
    }

    await blogPost.save();

    const thumbsUpCount = blogPost.thumbsUp;

    res.json({ thumbsUpCount });
  } catch (error) {
    console.error('Error updating thumbs-up:', error);
    res.status(500).json({ message: 'Error updating thumbs-up' });
  }
});



router.post('/blog-posts/:postId/thumbs-down', async (req, res) => {
  const { postId } = req.params;

  try {
    const blogPost = await BlogPost.findById(postId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }


    blogPost.disliked = !blogPost.disliked;

    if (blogPost.disliked) {
      blogPost.thumbsDown += 1;
    } else {
      blogPost.thumbsDown -= 1;
    }
    await blogPost.save();

    const thumbsDownCount = blogPost.thumbsDown;

    res.json({ thumbsDownCount });
  } catch (error) {
    console.error('Error updating thumbs-down:', error);
    res.status(500).json({ message: 'Error updating thumbs-down' });
  }
});



router.post('/blog-posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { content, author } = req.body;


  // if (!content || !author) {
  //   return console.log('all field are required')
  // }

  try {
    const blogPost = await BlogPost.findById(postId);

    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      content,
      author,
    };

    blogPost.comments.push(newComment);
    await blogPost.save();

    const allComments = blogPost.comments;
    const blogAuthor = blogPost.author

    res.json({ comments: allComments, author: blogAuthor });

  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ message: 'Error submitting comment' });
  }
});



router.post('/blog-posts/:postId/comments/:commentId/replies', async (req, res) => {
  const { postId, commentId } = req.params;
  const { content, author } = req.body;

  try {
    const blogPost = await BlogPost.findById(postId);

    const comment = blogPost.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newReply = {
      _id: new mongoose.Types.ObjectId(),
      content,
      author,
    };

    comment.replies.push(newReply);
    await blogPost.save();

    const allReplies = comment.replies;

    res.json({ replies: allReplies });
  } catch (error) {
    console.error('Error submitting reply:', error);
    res.status(500).json({ message: 'Error submitting reply' });
  }
});



module.exports = router;
