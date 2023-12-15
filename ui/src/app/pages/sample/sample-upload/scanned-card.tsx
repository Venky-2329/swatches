import { Button, Card } from "antd";
import Meta from 'antd/es/card/Meta';
import image from '../../../../assets/Picture1.png';
import { useLocation, useParams } from "react-router-dom";
import { getAllSamplesData } from "libs/shared-services";
import { useEffect, useState } from "react";
import { SampleCardReq } from "libs/shared-models";

export default function ScannedCard(){
  const { state } = useLocation();
  const {id} = useParams();
  const [data,setData] = useState([])

  console.log(id)
  useEffect(()=>{
     if(id){
      getAll(id)
     }
  },[id])

  function getAll(val){
    const req = new SampleCardReq()
    req.itemNo = val
    getAllSamplesData(req).then((res) => {
      if (res.data) {
        setData(res.data);
        // notification.success({ message: res.internalMessage });
      } else {
        // notification.error({ message: res.internalMessage });
      }
    });
  }

    return(
        <>
        <Card cover={<img alt="example" src={image} style={{width:'20%',height:'60%'}} />}>
        <Meta
          title="Sample Digital Card"
          description={
            <div className="print">
              <div>Brand Name :{data[0]?.brandName} </div>
              <div>Style No : {data[0]?.styleNo}</div>
              <div>Item No : {data[0]?.itemNo}</div>
              <div>Item Description : {data[0]?.itemDescription}</div>
              <div>Category : {data[0]?.categoryName}</div>
              <div>Season : {data[0]?.seasonName}</div>
              <div>Fabric Content : {data[0]?.fabricContent}</div>
              <div>Fabric Count : {data[0]?.fabricCount}</div>
              <div>GSM : {data[0]?.gsm}</div>
              <div>FOB : {data[0]?.fob}</div>
              <div>Qty/Season : {data[0]?.qtyPerSeason}</div>
              <div>Location : {data[0]?.locationName}</div>
            </div>
          }
        />
      </Card>
        </>
    )
}