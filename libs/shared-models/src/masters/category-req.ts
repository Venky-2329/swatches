export class CategoryReq {
  categoryId: number;
  isActive: boolean;
  updatedUser: string;


  constructor(categoryId: number, isActive: boolean ,   updatedUser: string
    ) {
    (this.categoryId = categoryId), (this.isActive = isActive) , (  this.updatedUser= updatedUser
      );
  }
}
