export class AuthModel{
    userName:string;
    userId:number;
    userMail: string
    role : string
    constructor(userName:string,userId:number, userMail: string, role: string){
        this.userId = userId;
        this.userName = userName;
        this.userMail = userMail
        this.role = role
    }
}