const express = require('express');
const redis = require('redis');
const app = express();
const OpenAI = require("openai");
const { v4: uuidv4 } = require('uuid');
const { stableDiffusionTxt2Img, stableDiffusionResultToFile } = require('./lib/stable_diffusion');
const openAiCompletionsCreate = require('./lib/openai');
const { initializeOrSaveMessages, retrieveMessages, saveMessage } = require('./lib/messages');
require('dotenv').config();
const port = 3000;

let redisClient;

(async () => {
  redisClient = redis.createClient({
    socket: {
      host: 'redis'
    }
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();


const openai = new OpenAI({
    baseURL: process.env.OPEN_AI_BASE_URL,
    apiKey: process.env.OPEN_AI_API_KEY,
});

const key = 'chat:' + uuidv4() 
console.log("key:")
console.log(key)

app.use(express.json());

app.use(express.static('public'));

app.use('/images', express.static('/public/images'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/save', async (req, res) => {
    var resBody = {}

    const lowerCaseMsg = req.body.content.toLowerCase()
    if (lowerCaseMsg.includes("generate a image")) {

        stableDiffusionTxt2Img(lowerCaseMsg, async resultBody => {    
            const fileName = `${uuidv4()}.jpeg`
            stableDiffusionResultToFile(resultBody, `./public/images/${fileName}`)
            resBody = { image: `/images/${fileName}`};
            res.json(resBody);
        })
    } else {
        await initializeOrSaveMessages(redisClient, key, req.body)
    
        const messages = await retrieveMessages(redisClient, key)
        const modelMsg = await openAiCompletionsCreate(openai, messages)
    
        saveMessage(redisClient, key, modelMsg)
    
        resBody = modelMsg;
        res.json(resBody);
    }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
