const https = require('https');

export const appConfig = {
  zingHr: {
    SubscriptionName: 'SHAHIMYHR',
    Token: '14d14d7a9c6b41fd8bfaa1939d80778d',
    liveURL: 'https://portal.zinghr.com/2015/route/Integration/SyncSwipeData',
  },
  m3Cred: {
    USER_NAME: 'planmnb',
    PASSWORD: 'planmnb7',
    headerRequest: () => {
      const auth =
        'Basic ' +
        Buffer.from(
          `${appConfig.m3Cred.USER_NAME}:${appConfig.m3Cred.PASSWORD}`
        ).toString('base64');
      const headersRequest = {
        Authorization: `${auth}`,
      };
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      return { headersRequest, agent };
    },
  },

  // grant_type: 'client_credentials',
  // client_id: 'l79e9dcd36eedb4817a0019e0add4fe25a',
  // client_secret: '6f38f265b90a4d95a1694ede16a9a681',

  // production keys
  grant_type: 'client_credentials',
  client_id: 'l7222cb4837c284c358f1d053d333265cb',
  client_secret: '0496b5b5-3dc4-4a23-9ca0-5af839ea31aa',
  internal_apps : {
    host : '172.20.50.169',
    dbName : 'internal_apps',
    dbUser : 'internal_apps',
    dbPassword : 'Schemax@2023',
    type : 'mysql'
  },
};

('https://portal.zinghr.com/2015/route/Integration/SyncSwipeData');
