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
import { FabricSwatchEntity } from '../swatch-masters/fabric-swatch/fabric-swatch-entity';

  export const typeOrmConfig: DataSourceOptions = {
    type: "mysql",
    host: '172.20.50.169',
    username: 'internal_apps',
    password: 'Schemax@2023',
    database: 'internal_apps',
    entities:[RacksEntity,RacksChildEntity,BrandsEntity,CategoryEntity,LocationEntity,SeasonEntity,UserEntity,SampleUpload,FabricSwatchEntity]
  };
  
  export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    useFactory: async (): Promise<TypeOrmModuleOptions> => {
      return {
        ...typeOrmConfig,
        synchronize: false,
        logging: true,
        //namingStrategy: new SnakeNamingStrategy(),
        //logger: new QueryLogger(new PinoLogger({ pinoHttp: { level: configService.get().logLevel } })),
        autoLoadEntities: true
      }
    },
  };
  
  