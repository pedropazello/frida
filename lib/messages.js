
async function initializeOrSaveMessages(redisClient, key, message) {
    const exists = await redisClient.get(key)

    if (!exists) {
        await redisClient.set(key, JSON.stringify(message))
    } else {
        await saveMessage(redisClient, key, message)
    }
}

async function retrieveMessages(redisClient, key) {
    const messages = await JSON.parse(`[${await redisClient.get(key)}]`)
    console.log("messages:")
    console.log(messages)
    return messages
}

async function saveMessage(redisClient, key, message) {
    await redisClient.append(key, `,${JSON.stringify(message)}`)
}

module.exports = {
    initializeOrSaveMessages,
    retrieveMessages,
    saveMessage
}