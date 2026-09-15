console.log('Loading function');
const AWS = require('aws-sdk');
const DRIVER_NAME = "Sally";
const MAX_WAIT = 10; //Wait calculated in 100s of milliseconds
const MIN_WAIT = 0; //Wait calculated in 100s of milliseconds
const REJECT_THRESHOLD = 4; //Driver will reject delivery if random wait time is less than or equal to this number
exports.handler = async (event, context) => {
    // Retrieve Order Number and Task Token
    var message = JSON.parse(event.Records[0].Sns.Message);
    var taskToken = message.TaskToken;
    console.log('Message received from SNS:', message); 
    console.log('Task token:', taskToken);

    function sleep(ms) {
         return new Promise(resolve => setTimeout(resolve, ms));
    }

    var randomWait = Math.floor(Math.random() * (+MAX_WAIT - +MIN_WAIT) + +MIN_WAIT)*100; 
    console.log('Random Wait Generated (ms) : ' + randomWait );  
    
    // Driver is not available to accept delivery
    if (randomWait <= REJECT_THRESHOLD*100) {
        console.log("Driver ", DRIVER_NAME, " is not available to accept the delivery");
        return;
    }
    
    // Simulate random response time of driver
    await sleep(randomWait);
    console.log('Sleeping for: ', randomWait, ' ms');

    // Return token to step functions
    var params = {
        output: JSON.stringify(DRIVER_NAME), /* required */
        taskToken: taskToken /* required */
    };

    console.log('JSON Returned to Step Functions:', params); 
    const stepfunctions = new AWS.StepFunctions();
    await stepfunctions.sendTaskSuccess(params, function(err, data) {
        if (err) console.log('Delivery has already been accepted by another driver ', err, err.stack);         // an error occurred
        else     console.log('Driver authorized to pick up delivery: ', JSON.stringify(data)); // successful response
    }).promise();
 
    return;
};

