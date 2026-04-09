import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    androidAppId: process.env.ANDROID_APP_ID,
  },
});

