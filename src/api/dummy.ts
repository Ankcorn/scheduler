import laconia from '@laconia/core';
import { apigateway } from '@laconia/adapter-api'
import { APIGatewayProxyHandlerV2 } from "aws-lambda";


export const app = async () => {
  return { success: true }
};

const apiadapiter = apigateway()
export const main: APIGatewayProxyHandlerV2 = laconia(apiadapiter(app))