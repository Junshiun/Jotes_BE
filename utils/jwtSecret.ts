import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Converter } from "aws-sdk/clients/dynamodb";

const dynamoDBClient = new DynamoDBClient({
    region: process.env.ENV_AWS_REGION
})

export const JwtSecret = async () => {
    try {

      if (process.env.JWT_SECRET) {
        console.log("returning env jwt secret");
        return process.env.JWT_SECRET
      }

      const command = new GetItemCommand({ // GetItemInput
        TableName: process.env.ENV_CONFIG_TABLE, // required
        Key: { // Key // required
          key: { 
            S: "jotes-secret-key" 
          },
        },
      })
  
      const res = await dynamoDBClient.send(command);
  
      if (res.Item) {
        return Converter.unmarshall(res.Item).value
      }

    } catch(err) {
      throw Error("not able to get jwt secret")
    }
}