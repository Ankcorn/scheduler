import laconia from '@laconia/core';
import { apigateway } from '@laconia/adapter-api'
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dynamodb = new DocumentClient();
export const app = async () => {
  const results = await dynamodb.query({
      TableName: process.env.TABLE_NAME,
      IndexName: 'customer',
      KeyConditionExpression: 'customer = :customer',
      ExpressionAttributeValues: {
        ':customer': 'thomas'
      }
  }).promise()
  return results;
};

const apiadapiter = apigateway({
    includeInputHeaders: true
})
export const main: APIGatewayProxyHandlerV2 = laconia(apiadapiter(app))