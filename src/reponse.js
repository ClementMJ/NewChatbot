'use strict';
const matcher=require('@/matcher');
function sendResponse(message){
    const response = ""
    matcher(message, async data => {
        try {
            switch (data.intent) {
                case 'Hello':
                    response = "Hello to you too!";
                    break;
                case 'Exit':
                    response = "Bye, have a great day!";
                    break;
                case 'Help':
                    response = "This bot is still being built";
                    break;
                default:
                    response = "Sorry, i don't understand this sentence";
            }
        }catch(e){
            console.log("Error occurred");
            response = "An internal error occurred.";
        }
    });
}

module.exports=sendResponse;