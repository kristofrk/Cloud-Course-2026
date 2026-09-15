const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

exports.handler = async (event) => {
    // Save aggregation result in the final invocation
    if (event.isFinalInvokeForWindow) {
        console.log("Final: ", event);

        const params = {
            TableName,
            Item: {
                windowStart: event.window.start,
                windowEnd: event.window.end,
                distance: Math.round(event.state.distance),
                shardId: event.shardId,
                name: event.state.name,
            },
        };
        console.log({ params });
        await docClient.put(params).promise();
    }
    console.log(JSON.stringify(event, null, 2));

    // Create the state object on first invocation or use state passed in
    let state = event.state;

    if (isEmpty(state)) {
        state = {
            distance: 0,
        };
    }
    console.log("Existing: ", state);

    // Process records with custom aggregation logic
    event.Records.map((record) => {
        const payload = Buffer.from(record.kinesis.data, "base64").toString(
            "ascii"
        );
        const item = JSON.parse(payload);

        let value = item.Distance;
        console.log("Adding: ", value);
        state.distance += value;

        let unicorn = item.Name;
        console.log("Name: ", unicorn);
        state.name = unicorn;
    });

    // Return the state for the next invocation
    console.log("Returning state: ", state);
    return { state: state };
};
