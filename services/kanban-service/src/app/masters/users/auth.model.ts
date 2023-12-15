export class AuthModel{
    userName:string;
    userId:number;
    constructor(userName:string,userId:number){
        this.userId = userId;
        this.userName = userName;
    }
}