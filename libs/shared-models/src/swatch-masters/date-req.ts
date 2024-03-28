export class DateReq{
    tabName?: string
    fromDate?: any
    toDate?: any
    buyerId?: number;
    grnNo?: string;
    supplierId ?: number;
    poNo?: string;
    styleNo?: string;
    itemNo?: string;
    approverId ?: number;

    constructor(
        tabName?: string,
        fromDate?: any,
        toDate?: any,
        buyerId?: number,
        grnNo?: string,
        supplierId ?: number,
        poNo?: string,
        styleNo?: string,
        itemNo?: string,
        approverId ?: number
    ){
        this.tabName = tabName
        this.fromDate = fromDate
        this.toDate = toDate
        this.buyerId = buyerId
        this.grnNo = grnNo
        this.supplierId = supplierId
        this.poNo = poNo
        this.styleNo = styleNo
        this.itemNo = itemNo
        this.approverId = approverId
    }
}

export class SwatchStatus{
    fabricSwatchId:number;
    fabricSwatchNumber?:string;
    rejectionReason?: string;

    constructor(
        fabricSwatchId:number,
        fabricSwatchNumber?:string,
        rejectionReason?: string
    ){
        this.fabricSwatchId = fabricSwatchId
        this.fabricSwatchNumber = fabricSwatchNumber
        this.rejectionReason = rejectionReason
    }
}

export class TrimSwatchStatus{
    trimSwatchId:number;
    trimSwatchNumber?:string;
    rejectionReason?: string;

    constructor(
        trimSwatchId:number,
        trimSwatchNumber?:string,
        rejectionReason?: string
    ){
        this.trimSwatchId = trimSwatchId
        this.trimSwatchNumber = trimSwatchNumber
        this.rejectionReason = rejectionReason
    }
}