const config = require('../config')
const { default: axios } = require('axios');
const { response } = require('express');


let url = 'https://www.thecocktaildb.com/api/json/v2/9973533/'


module.exports = nlpData => {
    return new Promise(async (resolve, reject) => {
        let intent = extractEntity(nlpData, 'intent')
        console.log(intent)
        if(intent){
            try{
                switch (intent) {
                    case 'aleatoire' :
                        console.log("la")
                        let TEST1 = await getRandom('random')
                        TEST2 = TEST1.drinks
                        RES12 = TEST2[0].strDrink
                        RES13 = TEST2[0].strInstructions
                        RES14 = getIngredients(TEST1)
                        
                        let RANDOMREP1 = "Nom du cocktail : "+RES12 +". Recette : "+ RES13 + ". \n Ingredients : "+ RES14
                        resolve(RANDOMREP1)
                        break;

                    case 'random_selection':

                        console.log('ici')
                        let random_select = await getSelection10Random('random')
                        console.log(random_select)
                        let names = ""
                        random_select.drinks.forEach(element => {
                            names += element.strDrink+"\n"
                            
                        });

                        //res4 = random_select.drinks[0].strInstructions
                        console.log('names : ' + names )
                        let random_selectRep = "Nom du cocktail : "+names 
                        //+". Recette : "+ res2
                        resolve(random_selectRep)
                        break;

                    case 'GetCocktailByAlcool' :

                        let alcooltype = extractEntity(nlpData,'Alcool')
                        let type = await getAlcoolByType(alcooltype)
                        let i = Math.floor(Math.random() * type.drinks.length); 
                        byAlcool = 'Name of the drink : ' +type.drinks[i].strDrink+ "\n"
                        cock_resp = await getByName(type.drinks[i].strDrink)
                        recipe = cock_resp.drinks[0].strInstructions
                        byAlcool += `Here is the recipe for ${type.drinks[i].strDrink}: ` + recipe+"\n"
                        ingredients =  getIngredients(cock_resp)
                        byAlcool+= "Here are the ingredients you might need : "+ingredients
                        //let image = await getImage(type.drinks[i].strDrinkThumb)
                        resolve(byAlcool)

                        break;
                    case 'cocktail_sans_alcool' :

                        console.log('la')
                        let res = await getSansAlcool('sansalcool')
                        console.log(res)
                        let j = Math.floor(Math.random() * res.drinks.length); 
                        withoutAlc = 'Name of the drink without alcool : ' +res.drinks[j].strDrink
                        WITHOUT_NAME = await getByName(res.drinks[j].strDrink)
                        console.log('NAME : ' + WITHOUT_NAME)
                        WITHOUT_ING = getIngredients(WITHOUT_NAME)
                        //let image = await getImage(res.drinks[i].strDrinkThumb+"/preview")
                        withoutAlc = withoutAlc + " \nIngredients : " + WITHOUT_ING + " \nInstructions : " + WITHOUT_NAME.drinks[0].strInstructions
                        resolve(withoutAlc)

                        break;
                    case 'popular' :

                        let popular = await getPopular('popular')
                        let k = Math.floor(Math.random() * popular.drinks.length); 
                        popular_name = await getByName(popular.drinks[k].strDrink)
                        popular_ing = getIngredients(popular_name)
                        //let image = await getImage(res.drinks[i].strDrinkThumb+"/preview")
                        popularRep = 'Popular cocktail : ' + popular.drinks[k].strDrink + '\nAnd his recipe : ' + popular.drinks[k].strInstructions + '\nIngredients : ' + popular_ing
                        resolve(popularRep)

                        break;

                    case 'latest_cocktails' :
                        
                        let latest_select = await getLatest('latest')
                        let names_latest = ""
                        latest_select.drinks.forEach(element => {
                            names_latest += element.strDrink+"\n"
                            
                        });
                        let random_selectlatest = "Nom des cocktails dernierement sortis  : "+names_latest 
                        //+". Recette : "+ res2
                        resolve(random_selectlatest)
                        break;

                    case 'getbyname' :
                        let entityName = extractEntity(nlpData, 'name')
                        //console.log(entityName)
                        myname = await getByName(entityName)
                        name_rep = 'Name cocktail : ' + myname.drinks[0].strDrink + '\nAnd his recipe : ' + myname.drinks[0].strInstructions 
                        resolve(name_rep)
                        break;
                    case '' :
                        break;
                    case 'exit' :
                        break;
                
                    }
                }
            catch (error){
                resolve("Sorry, I don't understand" )
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

const getPopular = blc =>{
    return new Promise(async (resolve, reject) => {
        let req = url + 'popular.php'
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

const getSelection10Random = random => {
    return new Promise(async (resolve, reject) => {
        let req = url + 'randomselection.php' + config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
const getLatest= latest => {
    return new Promise(async (resolve, reject) => {
        let req = url + 'randomselection.php' + config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

// const getImage = link =>{
//     return new Promise(async (resolve, reject) => {
//         let req = link 
//         axios.get(req).then(res => {
//             resolve(res.data)
//         }).catch(err => {
//             reject(err)
//         })
//     })
// }

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

const extractEntity = (nlp, entity) => {
    if(nlp.intents[0].confidence > 0.4){
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
    }
    else{
        return null
    }
}