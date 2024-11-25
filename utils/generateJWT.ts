import jwt from "jsonwebtoken";
import { JwtSecret } from "./jwtSecret";
// import { DynamoDBClient, GetItemCommand, ScanCommand, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
// import { Converter } from "aws-sdk/clients/dynamodb";

// const dynamoDBClient = new DynamoDBClient({
//   region: process.env.ENV_AWS_REGION
// })

const generateToken = async (id: string) => {

  try {
    // const command = new GetItemCommand({ // GetItemInput
    //   TableName: process.env.ENV_CONFIG_TABLE, // required
    //   Key: { // Key // required
    //     key: { 
    //       S: "jotes-secret-key" 
    //     },
    //   },
    // })

    // const res = await dynamoDBClient.send(command);

    const scrt = await JwtSecret();

    if (jwt) {
      return jwt.sign({ id }, scrt, {
        expiresIn: "30d",
      });
    } else {
      throw Error("secret is undefined")
    }
  } catch(err: unknown) {
    throw Error((err as Error).message);
  }
};

export {
  generateToken
};
