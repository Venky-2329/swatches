export class ApprovalIdReq {
    approvedUserId: number
}

export class ApprovalUserReq {
    approvedId: number
    isActive: boolean
    updatedUser: string;
}