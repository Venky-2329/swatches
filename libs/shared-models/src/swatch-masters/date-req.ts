export class DateReq{
    tabName?: string
    fromDate?: any
    toDate?: any
    swatchNo ?: string
    buyerId?: number;
    grnNo?: string;
    supplierId ?: number;
    poNo?: string;
    styleNo?: string;
    itemNo?: string;
    approverId ?: number;
    brandId?: number
    createdBy?: string

    constructor(
        tabName?: string,
        fromDate?: any,
        toDate?: any,
        swatchNo ?: string,
        buyerId?: number,
        grnNo?: string,
        supplierId ?: number,
        poNo?: string,
        styleNo?: string,
        itemNo?: string,
        approverId ?: number,
        brandId?: number,
        createdBy?: string
    ){
        this.tabName = tabName
        this.fromDate = fromDate
        this.toDate = toDate
        this.swatchNo = swatchNo
        this.buyerId = buyerId
        this.grnNo = grnNo
        this.supplierId = supplierId
        this.poNo = poNo
        this.styleNo = styleNo
        this.itemNo = itemNo
        this.approverId = approverId
        this.brandId = brandId
        this.createdBy = createdBy
    }
}

export class SwatchStatus{
    fabricSwatchId:number;
    fabricSwatchNumber?:string;
    rejectionReason?: string;
    reworkRemarks?: string;
    approvalRemarks?: string;
    remarks ?: string;

    constructor(
        fabricSwatchId:number,
        fabricSwatchNumber?:string,
        rejectionReason?: string,
        reworkRemarks?: string,
        approvalRemarks?: string,
        remarks ?: string
    ){
        this.fabricSwatchId = fabricSwatchId
        this.fabricSwatchNumber = fabricSwatchNumber
        this.rejectionReason = rejectionReason
        this.approvalRemarks = approvalRemarks
        this.reworkRemarks = reworkRemarks
        this.remarks = remarks
    }
}

export class TrimSwatchStatus{
    trimSwatchId:number;
    trimSwatchNumber?:string;
    rejectionReason?: string;
    reworkReason?: string;
    approvalRemarks?: string
    remarks?: string

    constructor(
        trimSwatchId:number,
        trimSwatchNumber?:string,
        rejectionReason?: string,
        reworkReason?: string,
        approvalRemarks?: string,
        remarks?: string

    ){
        this.trimSwatchId = trimSwatchId
        this.trimSwatchNumber = trimSwatchNumber
        this.rejectionReason = rejectionReason
        this.reworkReason = reworkReason
        this.approvalRemarks = approvalRemarks
        this.remarks = remarks
    }
}