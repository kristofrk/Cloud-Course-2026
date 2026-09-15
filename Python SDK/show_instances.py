import boto3 
import json

ec2 = boto3.client('ec2')
response = ec2.describe_instances()
print(response)
