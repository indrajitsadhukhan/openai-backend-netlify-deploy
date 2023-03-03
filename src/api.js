const express = require('express');
const serverless = require('serverless-http')
const dotenv =require('dotenv')
const cors =require('cors')
const { Configuration, OpenAIApi } = require('openai')


dotenv.config()
const app=express()
const router=express.Router()

const api_key=process.env.OPENAI_API_KEY
const configuration = new Configuration({
    apiKey: api_key,
  });
  
const openai = new OpenAIApi(configuration);

// Create completion
router.post('/completion', async (req, res) => {
    try {
      // Prompt = Content + Instruction
      const prompt = JSON.parse(req.apiGateway.event.body).prompt;
      console.log(prompt)
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0,
        max_tokens: 2000, 
        top_p: 1, 
        frequency_penalty: 0.5,
        presence_penalty: 0, 
      });
  
      res.status(200).send({
        bot: response.data.choices[0].text
      });
  
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



router.get('/',(req,res)=>{
    res.json({
        'Testing':'OK'
    })
})

app.use('/.netlify/functions/api',router)


module.exports.handler = serverless(app)