import { Handler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { randomUUID } from "crypto";
import { createTimePartition } from "./utils/dates";
const dynamodb = new DocumentClient();


//{ "scheduledTime": "2022-01-29T23:38:01.882Z", "destination": "email", "data": { "to": "thomasankcorn@gmail.com", "message": "hello" }}

export const handler: Handler = async (event) => {
  console.log(event)
  const id = randomUUID();

  const Item = {
    pk: createTimePartition(event.scheduledTime),
    sk: `${event.scheduledTime}#${id}`,
    id,
    scheduledTime: event.scheduledTime,
    destination: event.destination,
    data: event.data,
    complete: false
  };
  
  await dynamodb.put({
      TableName: process.env.TABLE_NAME,
      Item,
  }).promise()
  return Item;
};
