export class DateReq{
    tabName?: string
    fromDate?: any
    toDate?: any

    constructor(
        tabName?: string,
        fromDate?: any,
        toDate?: any,
    ){
        this.tabName = tabName
        this.fromDate = fromDate
        this.toDate = toDate
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