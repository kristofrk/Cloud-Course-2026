import sys
import boto3
from botocore.exceptions import ClientError
import os

def main():
    if len(sys.argv) != 3:
        print("Usage: python send_message_from_file.py <queue-name> <message-file>")
        sys.exit(1)

    queue_name = sys.argv[1]
    message_file = sys.argv[2]

    # Validate file existence
    if not os.path.isfile(message_file):
        print(f"Error: File '{message_file}' does not exist.")
        sys.exit(1)

    # Read the file contents
    try:
        with open(message_file, "r", encoding="utf-8") as f:
            message_body = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

    if not message_body.strip():
        print("Error: Message file is empty.")
        sys.exit(1)

    # Create SQS client
    sqs = boto3.client("sqs")

    try:
        # Get queue URL
        response = sqs.get_queue_url(QueueName=queue_name)
        queue_url = response["QueueUrl"]
        print(f"Queue URL: {queue_url}")

        # Send message
        send_response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=message_body
        )

        print(f"Message sent! MessageId: {send_response['MessageId']}")

    except ClientError as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()