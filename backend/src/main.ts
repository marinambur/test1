import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  await app.listen(port, host);

  const url = await app.getUrl();
  console.log(
    `✅ Server is listening on ${url} (GraphQL: ${url.replace(/\/$/, "")}/graphql)`
  );
}

bootstrap();
