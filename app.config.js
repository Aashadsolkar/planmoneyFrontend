
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.API_URL,
    ENV: process.env.NODE_ENV,
  },
});
