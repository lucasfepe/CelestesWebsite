
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
});
class SSMParams {
    UserPoolId;
    ClientId;
}
const ssmParams = new SSMParams();
// async function getParameters() {
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
    ssmParams.UserPoolId = userPoolIdParam.Parameter.Value;
    ssmParams.ClientId = clientIdParam.Parameter.Value;

} catch (error) {
    console.error("Error fetching parameters:", error);
    throw error;
}
// }
export default ssmParams;