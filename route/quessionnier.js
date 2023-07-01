

// const { OpenAI } = require('openai');

// const apiKey = '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'; // Replace with your actual API key

// const openai = new OpenAI(apiKey);

// async function askQuestion(question) {
//   const conversation = [
//     { role: 'system', content: 'You are a helpful assistant.' },
//     { role: 'user', content: question }
//   ];

//   try {
//     const response = await openai.chatCompletion.create({
//       model: 'gpt-3.5-turbo',
//       messages: conversation
//     });

//     const answer = response.choices[0].message.content;
//     console.log('Assistant:', answer);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// askQuestion('Who won the world series in 2020?');

