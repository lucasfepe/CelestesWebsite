
import API from 'utils/API';

class SSMParams {
    UserPoolId;
    ClientId;
}
const ssmParams = new SSMParams();
// async function getParameters() {
try {
    // Add AWS credentials configuration
    const userPoolIdParam = await API.get('/getparameter',
        {
            "parameterName": "UserPoolId"
        });
    const clientIdParam = await API.get('/getparameter',
        {
            "parameterName": "UserPoolClientId"
        });


    ssmParams.UserPoolId = userPoolIdParam;
    ssmParams.ClientId = clientIdParam;

} catch (error) {
    console.error("Error fetching parameters:", error);
    throw error;
}
// }
export default ssmParams;