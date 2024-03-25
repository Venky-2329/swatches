export class brandReq {
  brandId: number;
  isActive: boolean;
  updatedUser: string;


  constructor(brandId: number, isActive: boolean ,   updatedUser: string
    ) {
    (this.brandId = brandId), (this.isActive = isActive) , (  this.updatedUser= updatedUser
      );
  }
}
