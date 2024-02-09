async function openAiCompletionsCreate(openai, messages) {
    const response = await openai.chat.completions.create({
        model: process.env.OPEN_AI_MODEL_NAME,
        messages: messages,
        temperature: parseInt(process.env.OPEN_AI_MODEL_TEMPERATURE, 1),
        max_tokens: parseInt(process.env.OPEN_AI_MAX_TOKENS, 512),
        top_p: parseInt(process.env.OPEN_AI_TOP_P ,1),
        frequency_penalty: parseInt(process.env.FREQUENCY_PENALTY, 0),
        presence_penalty: parseInt(process.env.PRESENCE_PENALTY, 0),
    });

    return response.choices[0].message
}
  
module.exports = openAiCompletionsCreate
  