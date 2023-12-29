import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";
import { PdfReaderChildEntity } from "./pdf-child.entity";

@Entity('pdf-reader')
export class PdfReaderEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'pdf_id',
    })
    pdfId: number;

    @Column('varchar', {
        nullable: true,
        name: "date",
        length: 250
    })
    date: any;

    @Column('varchar', {
        nullable: true,
        name: "style",
        length: 250
    })
    style: string;

    @Column('varchar', {
        nullable: true,
        name: "season",
        length: 250
    })
    season: string;

    @Column('varchar', {
        nullable: true,
        name: "po_number",
        length: 250
    })
    poNumber: string;

    @Column('varchar', {
        nullable: true,
        name: "quantity",
        length: 250
    })
    quantity: string;

    @Column('varchar', {
        nullable: true,
        name: "item_no",
        length: 250
    })
    itemNo: string;

    @Column('varchar', {
        nullable: true,
        name: "factory",
        length: 250
    })
    factory: string;

    @Column('varchar', {
        nullable: true,
        name: "wash",
        length: 250
    })
    wash: string;

    @Column('varchar', {
        nullable: true,
        name: "prepared_by",
        length: 250
    })
    preparedBy: string;

    @Column('varchar', {
        nullable: true,
        name: "approved_by",
        length: 250
    })
    approvedBy: string;

    @Column('varchar', {
        nullable: true,
        name: "qa_approval",
        length: 250
    })
    qaApproval: string;

    @Column('varchar', {
        nullable: true,
        name: "remarks",
        length: 250
    })
    remarks: string;

    @Column('varchar', {
        nullable: true,
        name: "pdf_file_name",
        length: 250
    })
    pdfFileName: string;

    @Column('varchar', {
        nullable: true,
        name: "pdf_file_path",
        length: 250
    })
    pdfFilePath: string;

    @OneToMany(() => PdfReaderChildEntity , (pdfChiltEntity) => pdfChiltEntity.pdf,{cascade :true})
    pdfChiltEntity :PdfReaderChildEntity[];


}