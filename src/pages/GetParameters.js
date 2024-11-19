
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
});

async function getParameters() {
    console.log("process.env.AWS_ACCESS_KEY_ID: " + process.env.REACT_APP_AWS_ACCESS_KEY_ID);
    try {
        // Add AWS credentials configuration
        const userPoolIdParam = await ssmClient.send(
            new GetParameterCommand({
                Name: "UserPoolId",
            })
        );

        const clientIdParam = await ssmClient.send(
            new GetParameterCommand({
                Name: "UserPoolClientId",
            })
        );

        return {
            UserPoolId: userPoolIdParam.Parameter.Value,
            ClientId: clientIdParam.Parameter.Value,
        };
    } catch (error) {
        console.error("Error fetching parameters:", error);
        throw error;
    }
}
export default getParameters;