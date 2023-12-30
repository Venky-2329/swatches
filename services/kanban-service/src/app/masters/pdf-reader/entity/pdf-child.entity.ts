import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";
import { PdfReaderEntity } from "./pdf-reader.entity";

@Entity('pdf_reader_child')
export class PdfReaderChildEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'pdf_child_id',
    })
    pdfChildId: number;

    @Column('varchar', {
        nullable: true,
        name: "type",
        length: 250
    })
    type: string;

    @Column('varchar', {
        nullable: true,
        name: "sub_type",
        length: 250
    })
    subType: string;

    @Column('varchar', {
        nullable: true,
        name: "code",
        length: 250
    })
    code: string;

    @Column('varchar', {
        nullable: true,
        name: "product",
        length: 250
    })
    product: string;

    @Column('varchar', {
        nullable: true,
        name: "uom",
        length: 250
    })
    uom: string;

    @Column('varchar', {
        nullable: true,
        name: "material_artwork_desc",
        length: 250
    })
    materialArtworkDesc: string;

    @Column('varchar', {
        nullable: true,
        name: "supplier_quote",
        length: 250
    })
    supplierQuote: string;

    @Column('varchar', {
        nullable: true,
        name: "placement",
        length: 250
    })
    placement: string;

    @Column('varchar', {
        nullable: true,
        name: "contractor_supplied",
        length: 250
    })
    contractorSupplied: string;

    @Column('varchar', {
        nullable: true,
        name: "brn_brown_color",
        length: 250
    })
    brnBrownColor: string;

    @Column('varchar', {
        nullable: true,
        name: "brn_brown_qty_by_color",
        length: 250
    })
    brnBrownQtyByColor: string;

    @Column('varchar', {
        nullable: true,
        name: "blk_black_color",
        length: 250
    })
    blkBlackColor: string;

    @Column('varchar', {
        nullable: true,
        name: "blk_black_qty_by_color",
        length: 250
    })
    blkBlackQtyByColor: string;

    @Column('varchar', {
        nullable: true,
        name: "blk_file_path",
        length: 250
    })
    blkFilePath: string;

    @Column('varchar', {
        nullable: true,
        name: "blk_file_name",
        length: 250
    })
    blkFileName: string;

    @Column('varchar', {
        nullable: true,
        name: "brn_file_path",
        length: 250
    })
    brnFilePath: string;

    @Column('varchar', {
        nullable: true,
        name: "brn_file_name",
        length: 250
    })
    brnFileName: string;

    @ManyToOne(() => PdfReaderEntity, (pdf) => pdf.pdfChiltEntity)
    @JoinColumn({ name: "pdf_id" })
    pdf: PdfReaderEntity;

}