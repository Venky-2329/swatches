export class BuyerReq {
  buyerId: number;
  isActive: boolean;
  updatedUser: string;
  buyerName?:string
  buyerCode?: string

  constructor(
    buyerId: number, 
    isActive: boolean, 
    updatedUser: string,
    buyerName?:string,
    buyerCode?: string
  ) {
    this.buyerId = buyerId,
    this.isActive = isActive,
    this.updatedUser = updatedUser;
    this.buyerName = buyerName
    this.buyerCode = buyerCode
  }
}
