import { Button, Card, Col, Descriptions, Image, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useLocation, useParams } from 'react-router-dom';
import { getAllSamplesData } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { SampleCardReq } from 'libs/shared-models';
import './view.css'

export default function SeparateView() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  console.log(id);
  useEffect(() => {
    if (id) {
      getAll(id);
    }
  }, [id]);

  function getAll(val) {
    const req = new SampleCardReq();
    req.sampleId = val;
    getAllSamplesData(req).then((res) => {
      if (res.data) {
        setData(res.data);
        // notification.success({ message: res.internalMessage });
      } else {
        // notification.error({ message: res.internalMessage });
      }
    });
  }

  return (
    <>
      <Row gutter={24}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 14 }}
          xl={{ span: 14}}
        >
          <Image
            style={{ background: '#3f4648' }}
                src={
                  'http://172.20.50.169/design_room/dist/services/kanban-service/upload-files/' +
                  data[0]?.fileName
                }
          />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 10 }}
          xl={{ span:  10}}
        >
          <Descriptions style={{padding:'30px'}} title="Sample Info"   column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl:1 }} >
            <Descriptions.Item label="Brand Name"style={{ marginBottom: '8px' }} ><span style={{marginLeft:'40px'}}></span>: {data[0]?.brandName}</Descriptions.Item>
            <Descriptions.Item label="Style No" style={{ marginBottom: '8px' }}><span style={{marginLeft:'62px'}}></span>: {data[0]?.styleNo}</Descriptions.Item>
            <Descriptions.Item label="Item No"><span style={{marginLeft:'64px'}}></span>: {data[0]?.itemNo}</Descriptions.Item>
            <Descriptions.Item label="Item Description"><span style={{marginLeft:'20px'}}></span>: {data[0]?.itemDescription}</Descriptions.Item>
            <Descriptions.Item label="Category"><span style={{marginLeft:'60px'}}></span>: {data[0]?.categoryName}</Descriptions.Item>
            <Descriptions.Item label="Season"><span style={{marginLeft:'71px'}}></span>: {data[0]?.seasonName}</Descriptions.Item>
            <Descriptions.Item label="Mill"><span style={{marginLeft:'84px'}}></span>: {data[0]?.mill}</Descriptions.Item>
            <Descriptions.Item label="Fabric Content"><span style={{marginLeft:'33px'}}></span>: {data[0]?.fabricContent}</Descriptions.Item>
            <Descriptions.Item label="Fabric Count"><span style={{marginLeft:'44px'}}></span>: {data[0]?.fabricCount}</Descriptions.Item>
            <Descriptions.Item label="GSM"><span style={{marginLeft:'86px'}}></span>: {data[0]?.gsm}</Descriptions.Item>
            <Descriptions.Item label="FOB"><span style={{marginLeft:'89px'}}></span>: {data[0]?.fob}</Descriptions.Item>
            <Descriptions.Item label="Quantity"><span style={{marginLeft:'50px'}}></span>: {data[0]?.quantity}</Descriptions.Item>
            <Descriptions.Item label="Location"><span style={{marginLeft:'66px'}}></span>: {data[0]?.locationName}</Descriptions.Item>
            <Descriptions.Item label="SMV"><span style={{marginLeft:'86px'}}></span>: {data[0]?.smv}</Descriptions.Item>

          </Descriptions>
        </Col>
      </Row>
    </>
  );
}
