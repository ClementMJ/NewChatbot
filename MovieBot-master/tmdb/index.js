const config = require('../config')
const { default: axios } = require('axios');
const { response } = require('express');


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

const getIngredients = cocktail =>{
    
    let const_ingredients =""
    
   
    
    if (cocktail.drinks[0].strIngredient1!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient1+ " , " 
    }

    if (cocktail.drinks[0].strIngredient2!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient2+ " , " 
    }
    
    if (cocktail.drinks[0].strIngredient3!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient3+ " , " 
    }
    if (cocktail.drinks[0].strIngredient4!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient4+ " , " 
    }
    
    if (cocktail.drinks[0].strIngredient5!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient5+ " , " 
    }
    
    if (cocktail.drinks[0].strIngredient6!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient6+ " , " 
    }
    if (cocktail.drinks[0].strIngredient7!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient7+ " , " 
    }
    if (cocktail.drinks[0].strIngredient8!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient8+ " , " 
    }
    if (cocktail.drinks[0].strIngredient9!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient9+ " , " 
    }
    if (cocktail.drinks[0].strIngredient10!=null){
        const_ingredients+=cocktail.drinks[0].strIngredient10+ " , " 
    }
   
    
    
    return const_ingredients

} 
const getByName = name =>{

    return new Promise(async (resolve, reject) => {
        let req = url + 'search.php?s=' +name+ config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
const getRandom = random => {
    return new Promise(async (resolve, reject) => {
        let req = url + 'random.php' + config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
const getSansAlcool = nonAlcool => {
    return new Promise(async (resolve, reject) => {
        let req = url + 'filter.php?a=Non_Alcoholic' + config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
const getAlcoolByType = alcooltype => {
    return new Promise(async (resolve, reject) => {
        let req = url + 'filter.php?i=' +alcooltype+ config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
const getImage = link =>{
    return new Promise(async (resolve, reject) => {
        let req = link 
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
            let alcooltype = extractEntity(nlpData,'Alcool')
            let name = extractEntity(nlpData,'name')
            
            try{
                //let movieData = await getMovieData(movie, releaseYear)
                if(intent =='aleatoire')
                {
                    let random = await getRandom('random')
                    res = random.drinks[0].strDrink
                    res2 = random.drinks[0].strInstructions

                    let sentence = "Nom du cocktail : "+res +". Recette : "+ res2
                    console.log(sentence)
                    resolve(sentence)
                }
                if (intent == 'GetCocktailByAlcool'){
                    
                    let type = await getAlcoolByType(alcooltype)
                    
                    let i = Math.floor(Math.random() * type.drinks.length); 
                    sentence = 'Name of the drink : ' +type.drinks[i].strDrink+ "\n"
                    cock_resp = await getByName(type.drinks[i].strDrink)
                    recipe = cock_resp.drinks[0].strInstructions
                    sentence += `Here is the recipe for ${type.drinks[i].strDrink}: ` + recipe+"\n"
                    ingredients =  getIngredients(cock_resp)
                    sentence+= "Here are the ingredients you might need : "+ingredients
                    let image = await getImage(type.drinks[i].strDrinkThumb)
                    
                    resolve(sentence)
                }
                if (intent == 'cocktail_sans_alcool'){
                    let res = await getSansAlcool('sansalcool')
                    console.log(res)
                    let i = Math.floor(Math.random() * res.drinks.length); 
                    sentence = 'Name of the drink without alcool : ' +res.drinks[i].strDrink
                    let image = await getImage(res.drinks[i].strDrinkThumb+"/preview")

                    resolve(sentence)
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
                    let response = "teub"
                    // `The movie has been released the ${movieData.release_date}.\n
                    // It have a score of ${movieData.popularity}\n
                    // The original title is : ${movieData.original_title}\n
                    // Here is the overview : ${movieData.overview}`
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