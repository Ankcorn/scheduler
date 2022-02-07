import laconia from '@laconia/core';
import { apigateway } from '@laconia/adapter-api'
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { randomUUID } from "crypto";
import { createTimePartition } from "../utils/dates";
const dynamodb = new DocumentClient();


//{ "scheduledTime": "2022-01-29T23:38:01.882Z", "destination": "email", "data": { "to": "thomasankcorn@gmail.com", "message": "hello" }}
interface createSchedule {
    scheduledTime: string,
    destination: string,
    data: {
        [key: string]: any
    }
}
export const app = async (body: createSchedule) => {
  console.log(body)
  const id = randomUUID();

  const Item = {
    pk: createTimePartition(body.scheduledTime),
    sk: `${body.scheduledTime}#${id}`,
    id,
    scheduledTime: body.scheduledTime,
    destination: body.destination,
    data: body.data,
    complete: false,
    customer: 'thomas'
  };
  
  await dynamodb.put({
      TableName: process.env.TABLE_NAME,
      Item,
  }).promise()
  return Item;
};

const apiadapiter = apigateway({
    inputType: 'body',
    includeInputHeaders: true
})
export const main: APIGatewayProxyHandlerV2 = laconia(apiadapiter(app))