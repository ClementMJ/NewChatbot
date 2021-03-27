const express = require('express')
const bodyparser = require('body-parser')

const FBeamer = require('./FBeamer')
const conf = require('./config')

const server = express()
const PORT = 3000

let f = new FBeamer(conf.FB)

const movieData = require('./tmdb')

const menu =  `🍹Here is the menu🍹\n \nI'm an assistant Chatbot to help in your cocktail searching 🤖
\n🚀Here are the features I can provide 🚀 : 
\n1/ 🕵️‍♀️Search a cocktail by name 🕵️‍♀️
\n2/ 🌴Suggesting a random cocktail 🌴
\n3/ 🔞Search a cocktail by alcohol type 🔞
\n4/ 🎁Give you the 10 last realesed cocktails 🎁
\n5/ 🥦Non alcohol cocktail 🤮
\n6/ ☢️One of the most popular cocktails☢️
\n7/ 💯I can give you the recipe and the ingredients of a cocktail too 💯:) `

"🕵️‍♀️🥦🏉🤮🏆🚀🏖💣🎁☣️☢️🔞🚼❎⛔️💯🌴🏝"
server.get('/', (req, res) => f.registerHook(req, res))

server.post('/', bodyparser.json({
    verify: f.verifySignature.call(f)
}))

c = 0
server.post('/', (req, res, next) => {
    
    if(f.verifySignature(req, res, next)){
            return f.incoming(req, res, async data => {
            try{
                
                if(data.message.text == 'Hey'){
                    await f.txt(data.sender, 'Hey back !!')
                }
                if (data.message.text != null && c<1||data.message.text.toLowerCase=='menu')
                {
                    await f.txt(data.sender, menu)
                    c= c+1
                }
                
                else if(data.message.nlp.intents.length != 0){
                    movieData(data.message.nlp).then(response => {
                        f.txt(data.sender, response)
                    })
                }
                else{
                    f.txt(data.sender, "Can you sent me a full request ? ")
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

 