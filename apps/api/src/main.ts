import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const config = app.get(ConfigService);
  const configuredOrigins = (config.get<string>("WEB_ORIGIN") ?? "http://localhost:3020")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  // Keep common local ports available while developers work alongside other
  // projects. Production only accepts the explicitly configured origin(s).
  const localOrigins = config.get<string>("NODE_ENV") === "production"
    ? []
    : ["http://localhost:3000", "http://localhost:3020"];
  const origins = [...new Set([...configuredOrigins, ...localOrigins])];

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cookieParser());
  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || origins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS"), false);
    },
    methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
  app.setGlobalPrefix("v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  const port = Number(config.get<string>("PORT") ?? 4010);
  await app.listen(port, "0.0.0.0");
}

void bootstrap();
