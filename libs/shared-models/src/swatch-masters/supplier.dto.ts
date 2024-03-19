export class SupplierDto {
  supplierId: number;
  supplierName: string;
  createdUser: string;
  updatedUser: string;
  isActive : boolean;
  createdAt : Date;
  constructor(
    supplierId: number,
    supplierName: string,
    createdUser: string,
    updatedUser: string,
    isActive : boolean,
    createdAt : Date
  ) {
    this.supplierId = supplierId;
    this.supplierName = supplierName;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
    this.isActive = isActive;
    this.createdAt = createdAt
  }
}
