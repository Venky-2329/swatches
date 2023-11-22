import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
  } from '@nestjs/typeorm';
  import { DataSourceOptions } from 'typeorm';
  import 'dotenv/config';
import { RacksEntity } from '../masters/racks/entity/racks.entity';
import { RacksChildEntity } from '../masters/racks/entity/racks-child.entity';

  export const typeOrmConfig: DataSourceOptions = {
    type: "mysql",
    host: '172.20.50.169',
    username: 'internal_apps',
    password: 'Schemax@2023',
    database: 'internal_apps',
    entities:[RacksEntity,RacksChildEntity]
  };
  
  export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    useFactory: async (): Promise<TypeOrmModuleOptions> => {
      return {
        ...typeOrmConfig,
        synchronize: true,
        logging: false,
        //namingStrategy: new SnakeNamingStrategy(),
        //logger: new QueryLogger(new PinoLogger({ pinoHttp: { level: configService.get().logLevel } })),
        autoLoadEntities: true
      }
    },
  };
  
  