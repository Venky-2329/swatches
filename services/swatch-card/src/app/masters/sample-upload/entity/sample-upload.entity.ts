import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonFields } from '../../racks/entity/common.entity';

@Entity('sample_upload')
export class SampleUpload extends CommonFields {
  @PrimaryGeneratedColumn('increment', {
    name: 'sample_id',
  })
  sampleId: number;

  @Column('int', {
    nullable: false,
    name: 'brand_id',
  })
  brandId: number;

  @Column('varchar', {
    nullable: false,
    name: 'style_no',
    length: 250,
  })
  styleNo: string;

  @Column('varchar', {
    nullable: true,
    name: 'item_no',
    length: 250,
  })
  itemNo: string;

  @Column('varchar', {
    nullable: true,
    name: 'item_description',
    length: 250,
  })
  itemDescription: string;

  @Column('int', {
    nullable: true,
    name: 'category_id',
  })
  categoryId: number;

  @Column('int', {
    nullable: true,
    name: 'season_id',
  })
  seasonId: number;

  @Column('varchar', {
    nullable: true,
    name: 'fabric_content',
    length: 250,
  })
  fabricContent: string;

  @Column('varchar', {
    nullable: true,
    name: 'fabric_count',
    length: 250,
  })
  fabricCount: string;

  @Column('int', {
    nullable: true,
    name: 'quantity',
  })
  quantity: number;

  @Column('varchar', {
    nullable: true,
    name: 'gsm',
    length: 250,
  })
  gsm: string;

  @Column('varchar', {
    nullable: true,
    name: 'fob',
    length: 250,
  })
  fob: string;

  @Column('varchar', {
    nullable: true,
    name: 'qty_per_season',
    length: 250,
  })
  qtyPerSeason: string;

  @Column('int', {
    nullable: true,
    name: 'location_id',
  })
  locationId: number;

  @Column('varchar', {
    nullable: true,
    name: 'file_name',
    length: 250,
  })
  fileName: string;

  @Column('varchar', {
    nullable: true,
    name: 'file_path',
    length: 250,
  })
  filePath: string;

  @Column('varchar', {
    nullable: true,
    name: 'category_type',
    length: 250,
  })
  categoryType: string;

  @Column('varchar', {
    nullable: true,
    name: 'smv',
    length: 250,
  })
  smv: string;

  @Column('varchar', {
    nullable: true,
    name: 'mill',
    length: 250,
  })
  mill: string;

  @Column('varchar', {
    nullable: true,
    name: 'sourcing_name',
    length: 250,
  })
  sourcingName: string;

  @Column('varchar', {
    nullable: true,
    name: 'qr_code',
    length: 250,
  })
  qrCode: string;

  @Column('varchar', {
    nullable: true,
    name: 'fabric_po',
    length: 250,
  })
  fabricPo: string;

  @Column('varchar', {
    nullable: true,
    name: 'color',
    length: 250,
  })
  color: string;

  @Column('varchar', {
    nullable: true,
    name: 'count_and_contruction',
    length: 250,
  })
  countAndContruction: string;

  @Column('varchar', {
    nullable: true,
    name: 'width',
    length: 250,
  })
  width: string;

  @Column('varchar', {
    nullable: true,
    name: 'awb_No',
    length: 250,
  })
  awbNo: string;
}
