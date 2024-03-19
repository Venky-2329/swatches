export class BuyerReq {
    buyerId: number;
    isActive: boolean;
    updatedUser: string;
  
  
    constructor(buyerId: number, isActive: boolean ,   updatedUser: string
      ) {
      (this.buyerId = buyerId), (this.isActive = isActive) , (  this.updatedUser= updatedUser
        );
    }
  }
  