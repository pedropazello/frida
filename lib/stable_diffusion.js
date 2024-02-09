const fs = require('fs');

function stableDiffusionTxt2Img(prompt, successCallback) {
    const data = {
        "prompt": `${prompt}"`,
        "steps": process.env.STABLE_DIFFUSION_STEPS,
        "sampler": process.env.STABLE_DIFFUSION_SAMPLER,
        "cfg_scale": process.env.STABLE_DIFFUSION_CFG_SCALE,
        "seed": process.env.STABLE_DIFFUSION_SEED,
        "size": process.env.STABLE_DIFFUSION_IMAGE_SIZE,
        "model_hash": process.env.STABLE_DIFFUSION_MODEL_HASH,
        "model": process.env.STABLE_DIFFUSION_MODEL_NAME,
        "version": process.env.STABLE_DIFFUSION_VERSION
    }

    fetch(
        process.env.STABLE_DIFFUSION_TXT2IMG_ENDPOINT,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(data),
        }
        
    ).then(async result => {
        const resultBody = await result.json()
        console.log("result body")
        console.log(resultBody)

        successCallback(resultBody)
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

function stableDiffusionResultToFile(resultBody, filePath) {
    const buffer = Buffer.from(resultBody.images[0], 'base64');

    fs.writeFile(filePath, buffer, (err) => {
        if (err) throw err;
        console.log('image saved!');
    });
}
  
module.exports = {
    stableDiffusionTxt2Img,
    stableDiffusionResultToFile
}
  