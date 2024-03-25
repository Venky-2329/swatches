import { EmailModel } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";

export class EmailService extends CommonAxiosServicePms {
    private dcController = '/fabric-swatch';
    
    async sendSwatchMail(req: EmailModel) {
        return await this.axiosPostCall(this.dcController + '/sendSwatchMail', req)
    }
    
}