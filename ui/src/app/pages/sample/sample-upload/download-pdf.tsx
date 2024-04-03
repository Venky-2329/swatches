import { Button, Card } from "antd";
import Meta from 'antd/es/card/Meta';
import image from '../../../../assets/Picture1.png';

export interface Props {
  data: any;
}

export default function DownloadCard(props: Props) {
  return (
    <>
      <Card cover={<img alt="example" src={'http://ddr7.shahi.co.in/services/kanban-service/upload-files/'+ props.data.fileName} style={{width:'50%',height:'60%'}} />}>
        <Meta
          title="Sample Digital Card"
          description={
            <div className="print">
              <div>Brand Name : {props.data.brandName}</div>
              <div>Style No : {props.data.styleNo}</div>
              <div>Item No : {props.data.itemNo}</div>
              <div>Item Description : {props.data.itemDescription}</div>
              <div>Category : {props.data.categoryName}</div>
              <div>Season : {props.data.seasonName}</div>
              <div>Fabric Content : {props.data.fabricContent}</div>
              <div>Fabric Count : {props.data.fabricCount}</div>
              <div>GSM : {props.data.gsm}</div>
              <div>FOB : {props.data.fob}</div>
              <div>Qty/Season : {props.data.qtyPerSeason}</div>
              <div>Location : {props.data.locationName}</div>
            </div>
          }
        />
      </Card>
    </>
  );
}
