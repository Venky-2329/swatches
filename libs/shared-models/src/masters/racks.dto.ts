
export class RacksDto{
    rackName:string;
    columns:number;
    rows:number;
    createdUser: string | null;
    updatedUser: string | null;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    tableData:any[]
}