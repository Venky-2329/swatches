import { DataSource } from "typeorm";
import { DxmShipmentCreation } from "./entity/shipment-creation.entity";

export const DxmProviders = [
    {
      provide: 'DXM_SHIPMENT_CREATION',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(DxmShipmentCreation),
      inject: ['INTERNAL_APPS'],
    },
]