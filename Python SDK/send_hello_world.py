import sys
import boto3
from botocore.exceptions import ClientError

def main():
    if len(sys.argv) != 2:
        print("Usage: python send_hello_world.py <queue-name>")
        sys.exit(1)

    queue_name = sys.argv[1]

    # Create SQS client
    sqs = boto3.client("sqs")

    try:
        # Get queue URL from the queue name
        response = sqs.get_queue_url(QueueName=queue_name)
        queue_url = response["QueueUrl"]
        print(f"Queue URL: {queue_url}")

        # Send the "Hello World" message
        send_response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody="Hello World"
        )

        print(f"Message sent! MessageId: {send_response['MessageId']}")

    except ClientError as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()