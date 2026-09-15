"use strict";

import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

// Entrypoint for Lambda Function
export const handler = async (event) => {
    try {
        const requestItems = buildRequestItems(event.Records);
        const requests = buildRequests(requestItems);

        await Promise.all(requests);

        return `Delivered ${event.Records.length} records`;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Build DynamoDB request payload
function buildRequestItems(records) {
    return records.map((record) => {
        const json = Buffer.from(record.kinesis.data, "base64").toString("utf-8");
        const item = JSON.parse(json);

        return {
            PutRequest: {
                Item: item,
            },
        };
    });
}

function buildRequests(requestItems) {
    const requests = [];
    while (requestItems.length > 0) {
        const request = batchWrite(requestItems.splice(0, 25));
        requests.push(request);
    }

    return requests;
}

// Batch write items into DynamoDB table using DynamoDB API
function batchWrite(requestItems, attempt = 0) {
    const params = {
        RequestItems: {
            [tableName]: requestItems,
        },
    };

    let delay = 0;

    if (attempt > 0) {
        delay = 50 * Math.pow(2, attempt);
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            dynamoDB
                .batchWrite(params)
                .promise()
                .then((data) => {
                    if (data.UnprocessedItems && data.UnprocessedItems.hasOwnProperty(tableName)) {
                        return batchWrite(data.UnprocessedItems[tableName], attempt + 1);
                    }
                    resolve(); // Ensure resolution when no unprocessed items remain
                })
                .catch(reject);
        }, delay);
    });
}