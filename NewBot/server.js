const express = require('express')
const bodyparser = require('body-parser')

const FBeamer = require('./FBeamer')
const conf = require('./config')

const server = express()
const PORT = 3000

let f = new FBeamer(conf.FB)

const movieData = require('./tmdb')


server.get('/', (req, res) => f.registerHook(req, res))

server.post('/', bodyparser.json({
    verify: f.verifySignature.call(f)
}))

server.post('/', (req, res, next) => {
    if(f.verifySignature(req, res, next)){
            return f.incoming(req, res, async data => {
            try{
                if(data.message.text == 'Hey'){
                    await f.txt(data.sender, 'Hey back !!')
                }
                else if(data.message.text == 'Image'){
                    await f.img(data.sender, 'https://cdn.discordapp.com/attachments/580315649398800384/710457679046377472/B9720724098Z.png')
                }
                else if(data.message.nlp.intents.length != 0){
                    movieData(data.message.nlp).then(response => {
                        f.txt(data.sender, response)
                    })
                }
                else{
                    f.txt(data.sender, "C'est pas sympa d'être méchant")
                }
            }
            catch(e){
                console.log(e)
            }
        })
    }
    else{
        console.log('Bad request')
    }

})

server.listen(PORT, () => {
    console.log("The server is running on port " + PORT)
})

