import { API_URL } from "../config";
import axios from 'axios';
import {CommonResponseModel, SampleCardReq} from 'libs/shared-models'

const endPoint = API_URL + '/sample-upload'
const userUrl = API_URL + '/users'
const brandUrl = API_URL + '/brands'
const categoryUrl = API_URL + '/category'
const locationUrl = API_URL + '/location'
const seasonUrl = API_URL + '/season'

export async function createSample(req: any): Promise<CommonResponseModel> {
    console.log(req,'shared serv')
    const response = await axios.post(endPoint + '/create', req);
    return response.data;
  }

  export async function getAllSamplesData(req?:SampleCardReq):Promise<CommonResponseModel>{
    const response =await axios.post(endPoint + '/getData',req)
    return response.data
  }

export async function uploadPhoto(file:any) :Promise<CommonResponseModel>{
    const response = await axios.post(endPoint + '/photoUpload',file);
    return response.data
}

export async function createBrands(req: any): Promise<CommonResponseModel> {
  const response = await axios.post(brandUrl + '/createBrand', req);
  return response.data;
}

export async function getBrandsData():Promise<CommonResponseModel>{
  const response =await axios.post(brandUrl + '/getData')
  return response.data
}

export async function createCategory(req: any): Promise<CommonResponseModel> {
  const response = await axios.post(categoryUrl + '/create', req);
  return response.data;
}

export async function getCategoryData():Promise<CommonResponseModel>{
  const response =await axios.post(categoryUrl + '/getData')
  return response.data
}

export async function createLocation(req: any): Promise<CommonResponseModel> {
  const response = await axios.post(locationUrl + '/create', req);
  return response.data;
}

export async function getLocationData():Promise<CommonResponseModel>{
  const response =await axios.post(locationUrl + '/getData')
  return response.data
}

export async function createSeason(req: any): Promise<CommonResponseModel> {
  const response = await axios.post(seasonUrl + '/create', req);
  return response.data;
}

export async function getSeasonData():Promise<CommonResponseModel>{
  const response =await axios.post(seasonUrl + '/getData')
  return response.data
}

export async function logIn(req:any):Promise<CommonResponseModel>{
  const response =await axios.post(userUrl + '/login',req)
  return response.data
}

export async function createUser(req:any):Promise<CommonResponseModel>{
  const response =await axios.post(userUrl + '/create',req)
  return response.data
}

export async function getUserData():Promise<CommonResponseModel>{
  const response =await axios.post(userUrl + '/getData')
  return response.data
}



