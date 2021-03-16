const express = require('express');
const bodyParser = require('body-parser');
const token = 'EAAC1KvyfFY8BAGqDGYCwjzGOcBbzBewU1RijCXMuhNcCyYOjM5XAXdvNEvGLph6MaZArzv0aNI9gH1Ra0uOJ4Ks4f1YmiShoUIjgrcBHdFVecP2cBHZCJ7SQQQpErYhkWt7GwqdJRZC3JhlUU98jXDf33n7v7U9faZB8jJahJQZDZD'
const verify = 'pusher-bot'
const TOKEN_WIT = 'LJLNWMZIVZEY7AG7OJBU3Y4YJNDYH467'

request = require('request');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Respond with 'Hello World' when a GET request is made to the homepage
app.get('/', function (_req, res) {
    res.send('Hello World');
  });
  
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = verify;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);

        } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
        }
    }
});

// Creates the endpoint for your webhook
app.post('/webhook', (req, res) => {
    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];
        console.log(webhookEvent);

        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        console.log('Sender PSID: ' + senderPsid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
            handleMessage(senderPsid, webhookEvent.message);
        } else if (webhookEvent.postback) {
            handlePostback(senderPsid, webhookEvent.postback);
            console.log('Ca rentre ici ? ')
        }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {

        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});
  
// Handles messages events
function handleMessage(senderPsid, receivedMessage) {
let response;

// Checks if the message contains text
if (receivedMessage.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of your request to the Send API
    response = {
    'text': `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`
    };
} else if (receivedMessage.attachments) {
    // Get the URL of the message attachment
    let attachmentUrl = receivedMessage.attachments[0].payload.url;
    response = {
    'attachment': {
        'type': 'template',
        'payload': {
        'template_type': 'generic',
        'elements': [{
            'title': 'Is this the right picture?',
            'subtitle': 'Tap a button to answer.',
            'image_url': attachmentUrl,
            'buttons': [
            {
                'type': 'postback',
                'title': 'Yes!',
                'payload': 'yes',
            },
            {
                'type': 'postback',
                'title': 'No!',
                'payload': 'no',
            }
            ],
        }]
        }
    }
    };
}

// Send the response message
callSendAPI(senderPsid, response);
}

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { 'text': 'Thanks!' };
    } else if (payload === 'no') {
        response = { 'text': 'Oops, try sending another image.' };
    }
    // Send the message to acknowledge the postback
    callSendAPI(senderPsid, response);
}

// Sends response messages via the Send API
function callSendAPI(senderPsid, response) {
    // The page access token we have generated in your app settings
    const PAGE_ACCESS_TOKEN = token
    // Construct the message body
    let requestBody = {
        'recipient': {
        'id': senderPsid
        },
        'message': response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        'uri': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': { 'access_token': PAGE_ACCESS_TOKEN },
        'method': 'POST',
        'json': requestBody
    }, (err, _res, _body) => {
        if (!err) {
        console.log('Message sent!');
        } else {
        console.error('Unable to send message:' + err);
        }
});
}
  

app.listen(6000, () => console.log('Express server is listening on port 6000'));

//curl -X GET "https://15b21fc750d0.ngrok.io/webhook?hub.verify_token=EAAG6X8CXpBMBADrcxBGWQZCZCVMUJbM5ZCd9Hxc2jbTo6mhXQCaZAitGKxXeB8MHTAnbkP1l30gVYQhmZBx8RK2Az9soxhJCo0A3hG40ow9rUtozhF3ztbhPtErSD1sZAWKWwRqeC2PZAF6UZAR8AnuepWGeCouvBWXCFaTbh2sBs7qa99MFggvCJ2hyS7ZCi608ZD&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
//curl -H "Content-Type: application/json" -X POST "https://15b21fc750d0.ngrok.io/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'





