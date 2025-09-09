import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  console.log("Environment:", {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? "***masked***" : "not set",
    FRONTEND_URL: process.env.FRONTEND_URL || "not set"
  });

  app.enableCors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || true
        : [
            "http://localhost:3001",
            "http://127.0.0.1:3001",
            "http://localhost:3100",
            "http://127.0.0.1:3100",
          ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
      skipMissingProperties: true,
    })
  );

  const port = Number(process.env.PORT) || 4000;
  const host = "0.0.0.0";
  console.log("process.env.PORT =", process.env.PORT);
  console.log("Will bind to", host, "port", port);
  
  // Add simple health check route
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      port: port,
    });
  });

  await app.listen(port, host);

  const url = await app.getUrl();
  console.log(
    `✅ Server is listening on ${url} (GraphQL: ${url.replace(/\/$/, "")}/graphql)`
  );
  console.log(`📊 Health check available at: ${url}`);
  console.log(`🔍 GraphQL Playground available at: ${url.replace(/\/$/, "")}/graphql`);
}

bootstrap();
