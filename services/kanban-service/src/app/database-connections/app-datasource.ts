import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
  } from '@nestjs/typeorm';
  import { DataSourceOptions } from 'typeorm';
  import 'dotenv/config';
import { RacksEntity } from '../masters/racks/entity/racks.entity';
import { RacksChildEntity } from '../masters/racks/entity/racks-child.entity';
import { BrandsEntity } from '../masters/brands/entity/brands.entity';
import { CategoryEntity } from '../masters/category/entity/category.entity';
import { LocationEntity } from '../masters/location/entity/location.entity';
import { SeasonEntity } from '../masters/season/entity/season.entity';
import { UserEntity } from '../masters/users/entity/user.entity';
import { SampleUpload } from '../masters/sample-upload/entity/sample-upload.entity';

  export const typeOrmConfig: DataSourceOptions = {
    type: "mysql",
    // host: '172.20.50.169',
    // username: 'internal_apps',
    // password: 'Schemax@2023',
    // database: 'internal_apps',

    host: '172.20.50.170',
    username: 'sql_ddr7',
    password: 'mjxhMXEHaS2rnxE6',
    database: 'sql_ddr7',
    entities:[RacksEntity,RacksChildEntity,BrandsEntity,CategoryEntity,LocationEntity,SeasonEntity,UserEntity,SampleUpload]
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
  
  