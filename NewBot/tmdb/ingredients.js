const  getIngredients = require("./index")
module.exports = {
    
    getIngredients = cocktail =>{
    
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
        

} 
}