import json

def lambda_handler(event, context):
    # Get the name from the query string parameters
    name = event['queryStringParameters'].get('name', 'World')
    
    # Create the response message
    message = f"Hello from Lambda, {name}!"
    
    # Return the response
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # For CORS
        },
        'body': json.dumps({'message': message})
    }