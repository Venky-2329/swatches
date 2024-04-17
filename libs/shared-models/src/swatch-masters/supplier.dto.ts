export class supplierDto {
  supplierId: number;
  supplierCode: string;
  supplierName: string;
  createdUser: string;
  updatedUser: string;
  isActive : boolean;
  createdAt : Date;
  constructor(
    supplierId: number,
    supplierCode: string,
    supplierName: string,
    createdUser: string,
    updatedUser: string,
    isActive : boolean,
    createdAt : Date
  ) {
    this.supplierId = supplierId;
    this.supplierCode = supplierCode;
    this.supplierName = supplierName;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
    this.isActive = isActive;
    this.createdAt = createdAt
  }
}
