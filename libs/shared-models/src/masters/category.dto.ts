export class categoryDto {
  categoryId: number;
  categoryName: string;
  createdUser: string;
  updatedUser: string;
  constructor(
    categoryId: number,
    categoryName: string,
    createdUser: string,
    updatedUser: string
  ) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
  }
}
