export default (request, response) => {
    const pubnub = require('pubnub');
    const kvstore = require('kvstore');
    const xhr = require('xhr');

    let headersObject = request.headers;
    let paramsObject = request.params;
    let methodString = request.method;
    let bodyString = request.body;

  	let nameFooji;
  	let addressFooji;
  	let numberFooji;
  	let urlFooji;
  	let imgFooji;

    let nameFooji2;
  	let addressFooji2;
  	let numberFooji2;
  	let urlFooji2;
  	let imgFooji2;

    let nameFooji3;
  	let addressFooji3;
  	let numberFooji3;
  	let urlFooji3;
  	let imgFooji3;

    let VERIFY_TOKEN = 'food_emoji'; // your verify token goes here
    let PAGE_ACCESS_TOKEN = 'EAADb5OsUD9sBAGOzyknFoR8ErKQvUb0xgQyHlPHgzdDmfYlHEgVvt1fb9iYuV5UIIZAwintzgGg83ZA3ZA2IgdAcwGrbf0dBRKCZCg75e6cWbLXZCrS5HCzCnWpzLjlIPHNpSlp4pvSOkguNoQctGZCStPE7fsk8rN1xZAzzW56gwZDZD'; // your page access token goes here

    // Facebook validation
    if(methodString == 'GET'){
        if (paramsObject['hub.mode'] === 'subscribe' && paramsObject['hub.verify_token'] === VERIFY_TOKEN) {
            console.log("Validating webhook");
            response.status = 200;
            response.body = paramsObject['hub.challenge'];
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            response.status = 403;
        }

      return Promise.resolve(response);
    }else {
        let data = JSON.parse(request.body);

        // Make sure this is a page subscription
        if (data.object === 'page') {
            // Iterate over each entry - there may be multiple if batched
            data.entry.forEach(function(entry) {
                let pageID = entry.id;
                let timeOfEvent = entry.time;
                // Iterate over each messaging event
                entry.messaging.forEach(function(msg) {
                    if (msg.message) {
                        receivedMessage(msg);
                    } else if (msg.postback) {
                        // receivedPostback(msg);
                    } else {
                        console.log("Webhook received unknown event: ", event);
                    }
                });
            });

        }
        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.

        response.status = 200;

        return Promise.resolve(response);
    }

    function receivedMessage(event) {
        let senderID = event.sender.id;
        let recipientID = event.recipient.id;
        let timeOfMessage = event.timestamp;
        let message = event.message;

        console.log(`Received message for user ${senderID} and page ${recipientID} at ${timeOfMessage} with message: ${JSON.stringify(message)}`);

        let messageId = message.mid;
        let messageText = message.text;
        let messageAttachments = message.attachments;

        if (messageText) {
            // If we receive a text message, check to see if it matches a keyword
            // and send back the example. Otherwise, just echo the text we received.
            switch (messageText.codePointAt(0)) {
                case 127839:
                	getFoojiInfo("fast food", senderID);
                  break;
                case 127831:
                  getFoojiInfo("Chicken Wings", senderID);
                  break;
                case 127829:
                  getFoojiInfo("Pizza", senderID);
                  break;
                case 127843:
                  getFoojiInfo("Sushi", senderID);
                  break;
                case 127828:
                  getFoojiInfo("Burgers", senderID);
                  break;
                case 127814:
                  getFoojiInfo("Vegetarian", senderID);
                  break;
                case 127858:
                  getFoojiInfo("Ramen", senderID);
                  break;
                case 127837:
                  getFoojiInfo("Pasta", senderID);
                  break;
                case 127846:
                  getFoojiInfo("Dessert", senderID);
                  break;
                case 103:
                    sendGenericMessage(senderID);
                    break;
                default:
                    sendTextMessage(senderID, messageText.codePointAt(0));
            }
        } else if (messageAttachments) {
            sendTextMessage(senderID, "Message with attachment received");
        }
    }

    function sendTextMessage(recipientId, messageText) {
        let messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: "Sorry could not find emoji"
            }
        };
        callSendAPI(messageData);
        console.log("Successfully sent generic message");
    }


    function callSendAPI(messageData) {

        const http_options = {
        "method": "POST",
        "body": JSON.stringify(messageData),
        "headers": {
                'Content-Type': 'application/json'
            }
        };

        const url = "https://graph.facebook.com/v2.6/me/messages?access_token=" + PAGE_ACCESS_TOKEN;

        return xhr.fetch(url, http_options).then((x) => {
            const body = JSON.parse(x.body);
            return request.ok();
        });
    }






  function getFoojiInfo(item, senderID) {
    const xhr = require("xhr");
    const http_options = {
        "method": "GET",
        "headers": {
          "Authorization": "Bearer XyiAb3t0HstqslYzdyxRATyV-MO0SQKY9lV1nylBrkFAUPjdKnvz5mRiRS00gncGMrO0EYIdkoQkzYqPzi4NcPPH9ZzIqg6dKK9aOnx9ocIy55Zh4tIDx5CPJwVIWXYx"
            }
        };
    const query = require('codec/query_string');
    const query_params = {
        "location": "73 West St, Brooklyn, NY, 11222",
        "term": item,
        "limit": 5
    };

    const url = "https://api.yelp.com/v3/businesses/search" + "?" + query.stringify(query_params);

    return xhr.fetch(url, http_options).then((x) => {
        x.json().then((json) => {
            console.log(json.businesses[0].name);
          	nameFooji = json.businesses[0].name;
          	urlFooji = json.businesses[0].url;
          	imgFooji = json.businesses[0].image_url;
          	numberFooji = json.businesses[0].phone;

          	nameFooji2 = json.businesses[1].name;
          	urlFooji2 = json.businesses[1].url;
          	imgFooji2 = json.businesses[1].image_url;
          	numberFooji2 = json.businesses[1].phone;

          	nameFooji3 = json.businesses[2].name;
          	urlFooji3 = json.businesses[2].url;
          	imgFooji3 = json.businesses[2].image_url;
          	numberFooji3 = json.businesses[2].phone;


          	sendInfoToFB(senderID);
        })
        return request.ok();
    });
  };






   function sendInfoToFB(recipientId) {
      let messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: nameFooji,
                subtitle: "",
                item_url: urlFooji,
                image_url: imgFooji,
                buttons: [{
                  type: "web_url",
                  url: urlFooji,
                  title: "Open Web URL"
                }, {
                  type: "phone_number",
                  title: "Call Business",
                  payload: numberFooji,
                }],
              }, {
                title: nameFooji2,
                subtitle: "",
                item_url: urlFooji2,
                image_url: imgFooji2,
                buttons: [{
                  type: "web_url",
                  url: urlFooji,
                  title: "Open Web URL"
                }, {
                  type: "phone_number",
                  title: "Call Business",
                  payload: numberFooji2,
                }]
              },{
                title: nameFooji3,
                subtitle: "",
                item_url: urlFooji3,
                image_url: imgFooji3,
                buttons: [{
                  type: "web_url",
                  url: urlFooji,
                  title: "Open Web URL"
                }, {
                  type: "phone_number",
                  title: "Call Business",
                  payload: numberFooji3,
                }]
              }]
            }
          }
        }
      };

      callSendAPI(messageData);
    }
















    function sendGenericMessage(recipientId) {
      let messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: "rift",
                subtitle: "Next-generation virtual reality",
                item_url: "https://www.oculus.com/en-us/rift/",
                image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                buttons: [{
                  type: "web_url",
                  url: "https://www.oculus.com/en-us/rift/",
                  title: "Open Web URL"
                }, {
                  type: "postback",
                  title: "Call Postback",
                  payload: "Payload for first bubble",
                }],
              }, {
                title: "touch",
                subtitle: "Your Hands, Now in VR",
                item_url: "https://www.oculus.com/en-us/touch/",
                image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                buttons: [{
                  type: "web_url",
                  url: "https://www.oculus.com/en-us/touch/",
                  title: "Open Web URL"
                }, {
                  type: "postback",
                  title: "Call Postback",
                  payload: "Payload for second bubble",
                }]
              }]
            }
          }
        }
      };

      callSendAPI(messageData);
    }

    function receivedPostback(event) {
        let senderID = event.sender.id;
        let recipientID = event.recipient.id;
        let timeOfPostback = event.timestamp;

        // The 'payload' param is a developer-defined field which is set in a postback
        // button for Structured Messages.
        let payload = event.postback.payload;

        console.log(`Received postback for user ${senderID} and page ${recipientID} with payload ${payload} at ${timeOfPostback}`);

        // When a postback is called, we'll send a message back to the sender to
        // let them know it was successful
        sendTextMessage(senderID, "Postback called");
    }
}
