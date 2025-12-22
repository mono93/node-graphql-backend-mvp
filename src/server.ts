import express from 'express';

async function startServer(): Promise<void> {
  const app = express();
  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
}

await startServer();
