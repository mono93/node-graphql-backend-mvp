const envConfig = {
  port: +process.env.PORT!,
  mongoUri: process.env.MONGO_URI!,
  issuerBaseUrl: process.env.ISSUER_BASE_URL!,
  audience: process.env.AUDIENCE!,
  nameSpace: process.env.NAME_SPACE!,
};

export { envConfig };
