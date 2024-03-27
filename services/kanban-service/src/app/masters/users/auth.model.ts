export class AuthModel{
    userName:string;
    userId:number;
    userMail: string
    constructor(userName:string,userId:number, userMail: string){
        this.userId = userId;
        this.userName = userName;
        this.userMail = userMail
    }
}