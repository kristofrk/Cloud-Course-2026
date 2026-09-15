# Hello World — Lambda Greeter

A simple web app that submits a name to an AWS Lambda function via API Gateway, stores the greeting in DynamoDB, and displays a confirmation message.

## Files

- `HelloWorldFunction.py` — AWS Lambda function
- `index.html` — Web front end

## How It Works

1. The user enters a first and last name in the web form and clicks **Greet me**.
2. The page POSTs `{ "firstName": "...", "lastName": "..." }` to an API Gateway endpoint.
3. The Lambda function receives the request, records the name and a timestamp in the `HelloWorldDatabase` DynamoDB table, and returns a greeting.
4. The page displays: `[Name] has been greeted by Lambda at [timestamp]`.

## Setup

### 1. Deploy the Lambda Function

- Runtime: Python 3.x
- Handler: `HelloWorldFunction.lambda_handler`
- Required permission: `dynamodb:PutItem` on the `HelloWorldDatabase` table

### 2. Create the DynamoDB Table

- Table name: `HelloWorldDatabase`
- Partition key: `ID` (String)

### 3. Configure API Gateway

- Create a REST or HTTP API Gateway that triggers the Lambda function.
- Enable **CORS** on the endpoint so the browser can call it (`Access-Control-Allow-Origin`).
- Use **POST** method with a JSON request body.

### 4. Update the Web Page

In `index.html`, replace the placeholder on this line:

```js
const API_URL = 'YOUR_API_GATEWAY_URL';
```

with your actual API Gateway invoke URL.

## Notes

- The Lambda records the timestamp at function initialization time (module level), not per-invocation. For a per-invocation timestamp, move the `strftime` call inside `lambda_handler`.
- The timestamp shown in the browser is the client-side time the response was received. The Lambda does not return the DynamoDB timestamp in its response body. To display the exact Lambda-side timestamp, add it to the Lambda's return value.
