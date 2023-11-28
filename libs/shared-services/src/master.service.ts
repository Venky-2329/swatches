import {API_URL} from '../../shared-services/config';
import axios from 'axios';
import {CommonResponseModel, RackStatus} from 'libs/shared-models'

const endPoint = API_URL + '/racks'

export async function saveRacks(req: any): Promise<CommonResponseModel> {
    const response = await axios.post(endPoint + '/saveRacks', req);
    return response.data;
  }

  export async function getRacks(): Promise<CommonResponseModel> {
    const response = await axios.post(endPoint + '/getData');
    return response.data;
  }

  export async function getRacksData(): Promise<CommonResponseModel> {
    const response = await axios.post(endPoint + '/getRacksData');
    return response.data;
  }

  export async function updateRackStatus(req:RackStatus): Promise<CommonResponseModel> {
    const response = await axios.post(endPoint + '/updateRackStatus',req);
    return response.data;
  }