import * as sst from "@serverless-stack/resources";
import { TableFieldType } from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const table = new sst.Table(this, "Table1", {
      fields: {
        pk: TableFieldType.NUMBER,
        sk: TableFieldType.STRING,
        customer: TableFieldType.STRING
      },
      primaryIndex: { partitionKey: "pk", sortKey: "sk" },
      globalIndexes: {
        customer: {
          partitionKey: "customer", sortKey: "sk"
        }
      }
    });

    const queue = new sst.Queue(this, "Queue", {
      consumer: {
        permissions: [table],
        handler: "src/queueConsumer.handler",
        environment: {
          TABLE_NAME: table.tableName,
        }
        
      }
    });

    const cron = new sst.Cron(this, "Cron", {
      schedule: "rate(5 minutes)",
      job: {
        function: {
          handler: "src/lambda.handler",
          environment: {
            TABLE_NAME: table.tableName,
            QUEUE_URL: queue.sqsQueue.queueUrl,
          },
          permissions: [queue, table],
        }
      }
    });

    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
        permissions: [table]
      },
      routes: {
        "GET    /api/schedule": "src/api/list.main",
        "POST   /api/schedule": "src/api/create.main",
        "POST   /api/dummy": "src/api/dummy.main"
        // TODO
        // "GET    /api/schedule/{id}": "src/api/get.main",
        // "PUT    /api/schedule/{id}": "src/api/update.main",
        // "DELETE /api/schedule/{id}": "src/api/delete.main",
      }
    });
    // new sst.Function(this, "Function", {
    //   handler: "src/add_item.handler",
    //   environment: {
    //     TABLE_NAME: table.tableName,
    //   },
    //   permissions: [table],
    // })

    this.addOutputs({
      URL: api.url
    })
  }
}
