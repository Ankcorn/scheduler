import * as sst from "@serverless-stack/resources";
import { TableFieldType } from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const table = new sst.Table(this, "Table1", {
      fields: {
        pk: TableFieldType.NUMBER,
        sk: TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    });

    const queue = new sst.Queue(this, "Queue", {
      consumer: "src/queueConsumer.handler",
    });

    const cron = new sst.Cron(this, "Cron", {
      schedule: "rate(5 minutes)",
      job: {
        function: {
          handler:"src/lambda.handler",
          environment: {
            TABLE_NAME: table.tableName,
            QUEUE_URL: queue.sqsQueue.queueUrl,
          },
          permissions: [queue, table],
        } 
      }
    });
    new sst.Function(this, "Function", {
      handler: "src/add_item.handler",
      environment: {
        TABLE_NAME: table.tableName,
      },
      permissions: [table],
    })
    this.addOutputs({
    })
  }
}
