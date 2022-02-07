import { EventBridgeHandler} from "aws-lambda";
import laconia from "@laconia/core";
import SQS from 'aws-sdk/clients/sqs';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createTimePartition } from "./utils/dates";
import { create } from "domain";

const sqs = new SQS();
const dynamodb = new DocumentClient()

const send = async () => {

  const eventTime = createTimePartition(new Date().toString()) + 2;
  console.log(eventTime)

  const scheduledEvents = await dynamodb.query({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': eventTime
    }
  }).promise();

  console.log({ scheduledEvents: scheduledEvents.Items })
  if(scheduledEvents.Items) {
    for(const event of scheduledEvents.Items) {
      const delay = Math.floor((new Date(event.scheduledTime).getTime() - Date.now()) / 1000)
      console.log(delay)
      await sqs.sendMessage({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: JSON.stringify(event),
        DelaySeconds: delay - 1,
      }).promise()
    }
  }
  return scheduledEvents.Items
}

export const handler = laconia(send)


