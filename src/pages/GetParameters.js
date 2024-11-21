
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { getParameter } from "utils/ParameterStore";


class SSMParams {
    UserPoolId;
    ClientId;
}
const ssmParams = new SSMParams();
// async function getParameters() {
try {
    // Add AWS credentials configuration
    const userPoolIdParam = await getParameter("UserPoolId");

    const clientIdParam = await getParameter("UserPoolClientId");

    ssmParams.UserPoolId = userPoolIdParam;
    ssmParams.ClientId = clientIdParam;

} catch (error) {
    console.error("Error fetching parameters:", error);
    throw error;
}
// }
export default ssmParams;