# Cocktail Chatbot


The objective of our chatbot is to help the user in his search for a cocktail.

We used the Facebook developer messenger server and wit.ai for the NLP part.

We use the API of "thecocktaildb" which provides a list of cocktails of different specificity and the possibility of filtering according to different categories: alcoholic or non-alcoholic, based on a specific type of alcohol, etc ...

## How to use it :
Here is an example of communication with our chatbot:

-	Type "menu" to display the chatbot menu
-	Ask the question by using the words of the desired functionality.

Example: 

•	If you want: "Search a cocktail by name", you can write: "Tell me more about the Margarita cocktail".
•	Or if you want: "One of the most popular cocktails", you can write: "Give me a popular cocktail".

##How to connect ? :

Firstly you need to download our code.
Now you have to run server.js using nodemon
In order to get messenger be able to interact with our code, we have to set a public url with ngrok. To do so, download it and write in an new console ngrok http 3000(this the port where our api is listening). With this public url you have to set up in facebook developer a back up url and connect the wit.ai service. 
Finally you can go on facebook on this url: https://www.facebook.com/New_Chatbot-106581561513289/ and try to interact with our chatbot.

