export class supplierReq {
    supplierId: number;
    isActive: boolean;
    updatedUser: string;
  
  
    constructor(supplierId: number, isActive: boolean ,   updatedUser: string
      ) {
      (this.supplierId = supplierId), (this.isActive = isActive) , (  this.updatedUser= updatedUser
        );
    }
  }
  