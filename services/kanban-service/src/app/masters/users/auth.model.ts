export class AuthModel{
    userName:string;
    userId:number;
    userMail: string
    role : string
    departmentId: number
    constructor(userName:string,userId:number, userMail: string, role: string,departmentId: number){
        this.userId = userId;
        this.userName = userName;
        this.userMail = userMail
        this.role = role
        this.departmentId = departmentId
    }
}