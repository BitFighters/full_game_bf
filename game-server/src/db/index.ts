import AWS from "aws-sdk";
import { DeleteItemInput, GetItemInput, PutItemInput } from "aws-sdk/clients/dynamodb";
import _, { isEmpty } from "lodash";
import { isNullOrUndefined } from "util";
import { CONSTANTS_TABLE_NAME } from "./db_constants";

AWS.config.update({ region: "ap-south-1", accessKeyId: "AKIAYNF7T5IKNIR2MNPJ", secretAccessKey: "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" });

const documentClient = new AWS.DynamoDB.DocumentClient();

// export let JACKPOT_RANDOM_VALUE_DATA = 0.01

export async function GetConstantValue(key: string) {
  const options: GetItemInput = {
      Key: { key: key },
      TableName: CONSTANTS_TABLE_NAME,
  } as any;
  return documentClient.get(options).promise();
}


export const getItemFromConstantsDB = async (key) => {
  try {
    const result = await GetConstantValue(key)
    if (isEmpty(result) || _.isUndefined(result.Item)) {
      return null;
    }
    return result.Item;
  } catch (err) {
    console.log("err in getkeyvalue ", err)
    return null;
  }
}

// export async function GetJackPotConstantData() { let jackpotData = await getItemFromConstantsDB("JACKPOT_PROBABILITY_INFO")
//   console.log("________jackpotData_________", jackpotData)
//   if (isNullOrUndefined(jackpotData)) {
//     return
//   }
//   JACKPOT_RANDOM_VALUE_DATA = jackpotData.value;
//   console.log("________updated_random_value_jackpotData_________", JACKPOT_RANDOM_VALUE_DATA)
// }
