export class BuyerDto {
  buyerId: number;
  buyerName: string;
  createdUser: string;
  updatedUser: string;
  isActive : boolean;
  constructor(
    buyerId: number,
    buyerName: string,
    createdUser: string,
    updatedUser: string,
    isActive : boolean

  ) {
    this.buyerId = buyerId;
    this.buyerName = buyerName;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
    this.isActive = isActive
  }
}
