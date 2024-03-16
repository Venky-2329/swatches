export class BrandDto {
  brandId: number;
  brandName: string;
  brandCode: string;
  createdUser: string;
  updatedUser: string;
  constructor(
    brandId: number,
    brandName: string,
    brandCode: string,
    createdUser: string,
    updatedUser: string
  ) {
    this.brandId = brandId;
    this.brandName = brandName;
    this.brandCode = brandCode;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
  }
}
