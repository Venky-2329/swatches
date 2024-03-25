export class ApprovedUserDto {
    approvedId: number;
    userId: number;
    emailId:string;
    isActive: boolean;
    createdUser : string;
    versionFlag : number;
    signImageName ?: string;
    signPath ?: string

    constructor(
    approvedId: number,
    userId: number,
    emailId:string,
    isActive: boolean,
    createdUser : string,
    versionFlag : number,
    signImageName ?: string,
    signPath ?: string,
    ){
        this.approvedId = approvedId
        this.userId = userId
        this.emailId = emailId
        this.signImageName = signImageName
        this.signPath = signPath
        this.isActive = isActive
        this.createdUser = createdUser
        this.versionFlag = versionFlag
    }
}



