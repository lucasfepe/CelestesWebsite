import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({
    region: process.env.REACT_APP_AWS_REGION
});

export async function getParameter(parameterName) {
    try {
        console.log("Fetching parameter:", process.env.REACT_APP_AWS_ACCESS_KEY_ID);
        console.log("Fetching parameter:", process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);
        const response = await ssmClient.send(
            new GetParameterCommand({
                Name: parameterName
            })
        );
        return response.Parameter.Value;
    } catch (error) {
        console.error(`Error fetching parameter ${parameterName}:`, error);
        throw error;
    }
}
