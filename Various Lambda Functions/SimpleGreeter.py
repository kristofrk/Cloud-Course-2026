# import the json utility package since we will be working with a JSON object
import json
# import the AWS SDK (for Python the package name is boto3)
import boto3


# define the handler function that the Lambda service will use as an entry point
def lambda_handler(event, context):
# extract values from the event object we got from the Lambda service and store in a variable
    name = event['firstName'] +' '+ event['lastName']

# return a properly formatted JSON object
    return {
     'statusCode': 200,
     'body': json.dumps('Hello from Lambda, ' + name)
    }