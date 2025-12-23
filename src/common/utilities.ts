export const validateEnvVars = (requiredVariables: string[]): void => {
  const missingVariables = requiredVariables.filter((varName) => !process.env[varName]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing mandatory environment variables: ${missingVariables.join(', ')}`);
  }
};
