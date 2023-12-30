import { CommonResponseModel, PdfIdReq } from "libs/shared-models";
import { API_URL } from "../config";
import axios from "axios";


const endPoint = API_URL + '/pdf-reader'

export async function saveData(req: any): Promise<CommonResponseModel> {
    console.log('shared serfvie',req)
    const response = await axios.post(endPoint + '/saveData', req);
    return response.data;
  }

 export async function uploadFiles(file:any):Promise<CommonResponseModel>{
    console.log(file)
    const response = await axios.post(endPoint + '/uploadFiles', file);
    return response.data;
 }
 
 export async function getPdfData(req:PdfIdReq):Promise<CommonResponseModel>{
   const response = await axios.post(endPoint + '/getPdfData',req);
   return response.data;
}
export async function getPdfGridData():Promise<CommonResponseModel>{
   const response = await axios.post(endPoint + '/getPdfGridData');
   return response.data;
}