import { SQSHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import http from 'tiny-json-http';

const dynamodb = new DocumentClient();
interface Item {
  pk: number;
  sk: string;
  id: string;
  scheduledTime: any;
  destination: any;
  data: any;
  complete: boolean;
}

export const handler: SQSHandler = async (event) => {
  for(const record of event.Records) {
    try {
      const data: Item = JSON.parse(record.body);
      const response = await http.post({
        url: data.destination,
        data: data.data
      })
      await dynamodb.update({
        TableName: process.env.TABLE_NAME,
        Key: { pk: data.pk, sk: data.sk },
        UpdateExpression: 'set complete = :c, destinationResponse = :r',
        ExpressionAttributeValues: {
          ":c": true,
          ":r": response.body
        }
      }).promise()
    } catch (e) {
      console.log(e)
    }
    
  }
};
