import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";

import { TransactionModule } from "./transaction/transaction.module";
import { Transaction } from "./transaction/entities/transaction.entity";
import { databaseConfig } from "./config/database.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>("database.url");
        try {
          if (!url) {
            console.log("DB URL: <EMPTY>");
          } else {
            const u = new URL(url);
            const masked = `${u.protocol}//${u.username ? "***" : ""}${u.username ? ":" : ""}${u.password ? "***" : ""}${u.password ? "@" : ""}${u.hostname}:${u.port}/${u.pathname?.replace(/^\//, "")}`;
            console.log("DB URL (masked):", masked);
            console.log("DB HOST:", u.hostname, "PORT:", u.port || 5432);
          }
        } catch (e) {
          console.log("DB URL parse error:", e?.message);
        }

        const cfg: any = {
          type: "postgres",
          entities: [Transaction],
          synchronize: config.get("database.synchronize"),
          logging: config.get("database.logging"),
          retryAttempts: 10,
          retryDelay: 3000,
        };

        if (url) {
          cfg.url = url;
          // SSL только если это публичный railway.app
          try {
            const host = new URL(url).hostname;
            if (/\.railway\.app$/i.test(host)) {
              cfg.ssl = { rejectUnauthorized: false };
            }
          } catch {}
        } else {
          cfg.host = config.get("database.host");
          cfg.port = config.get<number>("database.port");
          cfg.username = config.get("database.username");
          cfg.password = config.get("database.password");
          cfg.database = config.get("database.name");
        }

        return cfg;
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    TransactionModule,
  ],
})
export class AppModule {}
