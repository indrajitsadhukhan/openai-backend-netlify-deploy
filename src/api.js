const express = require('express');
const serverless = require('serverless-http')
const cors =require('cors')
const { Configuration, OpenAIApi } = require('openai')
const app=express()
app.use(cors())
app.use(express.json())
const router=express.Router()
require('dotenv').config()
const api_key=process.env.OPENAI_API_KEY
const configuration = new Configuration({
    apiKey: api_key,
});

const openai = new OpenAIApi(configuration);

// Create completion
router.post('/completion', async (req, res) => {
    try {
      // Prompt = Content + Instruction
      const prompt = "Answer in less than 100 words."+JSON.parse(req.apiGateway.event.body).prompt;
      // console.log(prompt)
        
         const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 200, 
      top_p: 1, 
      frequency_penalty: 0.5,
      presence_penalty: 0, 
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

//       const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: `${prompt}`,
//         temperature: 0,
//         max_tokens: 400, 
//         top_p: 1, 
//         frequency_penalty: 0.5,
//         presence_penalty: 0, 
//       });

//       const response = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [{role: "user", content: `${prompt}`}],
//       });
      
//       res.status(200).send({
//         bot: response.data.choices[0].text
//       });
  
    } catch (error) {
      // console.error(error)
      console.log("Error 2")
      res.status(500).send(error || 'Something went wrong');
    }
  })

  // Create edit (Example - Spelling mistake, Change tone of text)
router.post('/edits', async (req, res) => {
    try {
      const input = JSON.parse(req.apiGateway.event.body).input
      const instruction = JSON.parse(req.apiGateway.event.body).instruction
  
      const response = await openai.createEdit({
        model: "text-davinci-edit-001",
        input: `${input}`,
        instruction: `${instruction}`,
        temperature:0.2
        
      });
  
      res.status(200).send({
        bot: response.data.choices[0].text
      });
  
    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })
  
  // Create image
  router.post('/images/generations', async (req, res) => {
    try {

        console.log(req)
      const prompt = JSON.parse(req.apiGateway.event.body).prompt
      const size =JSON.parse(req.apiGateway.event.body).size
      const number = JSON.parse(req.apiGateway.event.body).number
      const response = await openai.createImage({
        prompt: prompt,
        n:  number,
        size: size
      });
  ""
      res.status(200).send({
        bot: response.data
      });
  
    } catch (error) {
    //   console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })
  
  // Create image edit
  router.post('/images/edits', async (req, res) => {
    try {
  
      const image = JSON.parse(req.apiGateway.event.body).image
      const mask = JSON.parse(req.apiGateway.event.body).mask
      const prompt=JSON.parse(req.apiGateway.event.body).prompt
      const number=JSON.parse(req.apiGateway.event.body).number
      const size=JSON.parse(req.apiGateway.event.body).size
  
      const response = await openai.createEdit(
        image,
        mask,
        prompt,
        number,
        size
      );
  
      res.status(200).send({
        bot: response.data
      });
  
    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })
  
  // Create image variation
  router.post('/images/variations', async (req, res) => {
    try {
  
      const image = JSON.parse(req.apiGateway.event.body).image
      const number = JSON.parse(req.apiGateway.event.body).number
      const size=JSON.parse(req.apiGateway.event.body).size
  
  
      const response = await openai.createEdit(
        image,
        number,
        size
      );
  
      res.status(200).send({
        bot: response.data
      });
  
    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  })  

// POST Request to upload a new file
router.post("/upload", (req, res) => {
  // use modules such as express-fileupload, Multer, Busboy
  // TODO: API to be implemented

  setTimeout(() => {
      console.log('file uploaded')
      return res.status(200).json({ result: true, msg: 'file uploaded' });
  }, 3000);
});

// DELETE Request to delete an existing file
router.delete("/upload", (req, res) => {
  // TODO: API to be implemented
  
  console.log(`File deleted`)
  return res.status(200).json({ result: true, msg: 'file deleted' });
});


router.get('/',(req,res)=>{
    res.json({
        'Testing':'OK'
    })
})

app.use('/.netlify/functions/api',router)


module.exports.handler = serverless(app)
