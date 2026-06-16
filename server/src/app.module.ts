import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  dbConfig,
  redisConfig,
  qweatherConfig,
} from './config/configuration';
import { VenueModule } from './modules/venue/venue.module';
import { RecommendModule } from './modules/recommend/recommend.module';
import { WeatherModule } from './modules/weather/weather.module';
import { TagModule } from './modules/tag/tag.module';
import { VisitModule } from './modules/visit/visit.module';
import { DealModule } from './modules/deal/deal.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, redisConfig, qweatherConfig],
      envFilePath: ['.env'],
    }),

    // 数据库模块
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        autoLoadEntities: true,
        synchronize: true, // 开发阶段使用
        logging: ['error', 'warn'],
      }),
    }),

    // 业务模块
    VenueModule,
    RecommendModule,
    WeatherModule,
    TagModule,
    VisitModule,
    DealModule,
  ],
})
export class AppModule {}
