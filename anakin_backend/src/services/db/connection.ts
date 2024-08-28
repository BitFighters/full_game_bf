import { DynamoDB } from "aws-sdk";
import { DB_CONFIG as CONFIG } from "@config/db_config";
import { DataMapper } from "@aws/dynamodb-data-mapper";

const { REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = CONFIG.DATABASE_CONNECTION;

const dynamodb = new DynamoDB({
  region: REGION,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY
});

const mapper = new DataMapper({
  client: dynamodb
});

export { dynamodb as dbConnection, mapper };
