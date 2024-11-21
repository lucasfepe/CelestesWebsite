import cw from './CloudWatchService.js'
import ssmParams from './GetParameters.js'
let users1 = 0;
let users2 = 0;
let users = 0;
const getLogins = () => {

    var params = {
        MetricDataQueries: [
            {
                Id: "m1",
                ReturnData: true,
                MetricStat: {
                    Period: 1,

                    Stat: "Sum",
                    Metric: {
                        Namespace: "AWS/Cognito",
                        MetricName: "SignInSuccesses",
                        Dimensions: [
                            {
                                Name: "UserPool",
                                Value: ssmParams.UserPoolId
                            },
                            {
                                Name: "UserPoolClient",
                                Value: ssmParams.ClientId
                            }
                        ]
                    }
                },

                AccountId: process.env.REACT_APP_AWS_ACCOUNT_ID
            }
        ],
        StartTime: new Date(Date.now() - 1000 * 60 * 10),
        EndTime: (new Date()).toISOString()



    };
    cw.getMetricData(params, functionone);
}

const functionone = async (err, dataone) => {
    var params2 = {
        MetricDataQueries: [
            {
                Id: "m1",
                ReturnData: true,
                MetricStat: {
                    Period: 1,

                    Stat: "Sum",
                    Metric: {
                        Namespace: "AWS/Cognito",
                        MetricName: "TokenRefreshSuccesses",
                        Dimensions: [
                            {
                                Name: "UserPool",
                                Value: ssmParams.UserPoolId
                            },
                            {
                                Name: "UserPoolClient",
                                Value: ssmParams.ClientId
                            }
                        ]
                    }
                },

                AccountId: process.env.REACT_APP_AWS_ACCOUNT_ID
            }
        ],
        StartTime: new Date(Date.now() - 1000 * 60 * 10),
        EndTime: (new Date()).toISOString()
    };

    if (err) {

    } else {
        users1 = dataone.MetricDataResults[0].Values.reduce((a, b) => a + b, 0);
        cw.getMetricData(params2, functiontwo);
    }
}

const functiontwo = (err, datatwo) => {
    if (err) {

    } else {
        users2 = datatwo.MetricDataResults[0].Values.reduce((a, b) => a + b, 0);
        users = users1 + users2;
    }
}
export { getLogins, users };