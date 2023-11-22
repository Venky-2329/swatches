export class GlobalResponseObject {
    status: boolean;
    errorCode: number;
    internalMessage: string;
    /**
     *
     * @param status
     * @param errorCode
     * @param internalMessage
     */
    constructor(status: boolean, errorCode: number, internalMessage: string) {
        this.status = status;
        this.errorCode = errorCode;
        this.internalMessage = internalMessage;
    }
}

export class ErrorResponse extends Error {
    errorCode: number;
    message: string;
    constructor(errorCode: number, message: string) {
        super();
        this.errorCode = errorCode;
        this.message = message;
    }
}

export class CommonResponseModel extends GlobalResponseObject {
    status: boolean;
    errorCode: number;
    internalMessage: string;
    data?: any
    /**
     *
     * @param status
     * @param errorCode
     * @param internalMessage
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: any) {
        super(status, errorCode, internalMessage);
        this.data = data

    }
}

export function generateResponseModel(dataClass: any,name?:string) {
    class GeneratedClass extends GlobalResponseObject {
        status: boolean;
        errorCode: number;
        internalMessage: string;
        data: typeof dataClass;

        /**
    *
    * @param status
    * @param errorCode
    * @param internalMessage
    */
        constructor(status: boolean, errorCode: number, internalMessage: string, data: any) {
            super(status, errorCode, internalMessage);
            this.data = data
        }
    }
    if(name){
        Object.defineProperty(GeneratedClass,'name',name)
    }
    return GeneratedClass
}