import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { join } from 'path';
import { configValidationSchema, redisConfig, typeorm } from '../config';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [typeorm, redisConfig],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow('typeorm'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (headersRaw: Record<string, unknown>) => {
            const headers = Object.keys(headersRaw).reduce((dest, key) => {
              dest[key.toLowerCase()] = headersRaw[key];
              return dest;
            }, {});
            return {
              req: {
                headers: headers,
              },
            };
          },
        },
      },
      installSubscriptionHandlers: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config) => {
        const store = await redisStore({
          ttl: 30 * 1000,
          socket: {
            host: config.get('redis.host'),
            port: config.get('redis.port'),
          },
        });
        return { store };
      },
      inject: [ConfigService],
    }),
    SearchModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChatsModule,
    MessagesModule,
    PubSubModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
