export class SupplierDto {
  supplierId: number;
  supplierName: string;
  createdUser: string;
  updatedUser: string;
  constructor(
    supplierId: number,
    supplierName: string,
    createdUser: string,
    updatedUser: string
  ) {
    this.supplierId = supplierId;
    this.supplierName = supplierName;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
  }
}
