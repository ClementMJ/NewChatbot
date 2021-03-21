const config = require('../config')
const { default: axios } = require('axios');

let url = 'https://www.thecocktaildb.com/api/json/v1/1/'

const extractEntity = (nlp, entity) => {
    if(nlp.intents[0].confidence > 0.8){
        if(entity == 'intent'){
            return nlp.intents[0].name
        }
        else{
            try{
                return nlp.entities[entity+':'+entity][0].body
            }
            catch(e){//If entity does not exist
                return null
            }

        }
    }else{
        return null
    }
}

const getMovieData = (movie, releaseYear = null) => {
    return new Promise(async (resolve, reject) => {
        //First find the movie
        str = ''
        if(releaseYear == null){
            str = url+'search/movie?api_key=' + config.TMDB + '&query=' + movie
        }
        else{
            str = url+'search/movie?api_key=' + config.TMDB + '&query=' + movie + '&year=' + releaseYear
        }
        axios.get(str).then(res => {
            resolve(res.data.results[0])
        }).catch(err => {
            reject(err) // J'ai changé ici 
        })
    })
}

const getDirector = movieId => {
    return new Promise(async (resolve, reject) => {
        let req = url+'movie/' + movieId + '/credits?api_key=' + config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

const getRandom = blc => {
    return new Promise(async (resolve, reject) => {
        let req = url + 'random.php' + config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = nlpData => {
    return new Promise(async (resolve, reject) => {
        let intent = extractEntity(nlpData, 'intent')
        if(intent){
            let cocktail = extractEntity(nlpData, 'cocktail')
            //let movie = extractEntity(nlpData, 'movie')
            //let releaseYear = extractEntity(nlpData, 'releaseYear')
            try{
                //let movieData = await getMovieData(movie, releaseYear)
                if(intent =='aleatoire')
                {
                    let random = await getRandom('blc')
                    res = random[0].strDrink
                    resolve(res)
                }
                if(intent == 'director'){
                    let movieDataDetailed = await getDirector(movieData.id)
                    let res = 'No director found'
                    for(let j = 0; j < movieDataDetailed.crew.length; j++){
                        if(movieDataDetailed.crew[j].job == 'Director'){
                            res = 'The director is : ' + movieDataDetailed.crew[j].name
                        }
                    }
                    resolve(res)
                }
                else{
                    let response = `
                    The movie has been released the ${movieData.release_date}.\n
                    It have a score of ${movieData.popularity}\n
                    The original title is : ${movieData.original_title}\n
                    Here is the overview : ${movieData.overview}`
                    resolve(response)
                }
                
            }
            catch (error){
                reject(error)
            }
        }
        else{
            resolve({
                txt: "I'm not sure I understand you"
            })
        }
    })
}