import { Button, Card, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import image from '../../../../assets/Picture1.png';
import { useLocation, useParams } from 'react-router-dom';
import { getAllSamplesData } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { SampleCardReq } from 'libs/shared-models';

export default function ScannedCard() {
  const { state } = useLocation();
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
    <div>
      <Row gutter={24}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 6 }}
          lg={{ span: 6 }}
          xl={{ span: 9 }}
        >
          <Card
            hoverable
            style={{ background: '#3f4648' }}
            cover={
              <img
                alt="example"
                style={{ height: '100%', objectFit: 'cover' }}
                src={
                  'http://ddr7.shahi.co.in/services/kanban-service/upload-files/' +
                  data[0]?.fileName
                }
              />
            }
          >
            <Meta
              title={
                <div style={{ color: 'white' }}>
                  <b>Sample Digital Card</b>
                </div>
              }
              description={
                <div style={{ color: 'white' }} className="print">
                  <div>
                    Brand Name
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.brandName}{' '}
                  </div>
                  <div>
                    Style No
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.styleNo}
                  </div>
                  <div>
                    Item No
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.itemNo}
                  </div>
                  <div>
                    Item Description &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.itemDescription}
                  </div>
                  <div>
                    Category
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.categoryName}
                  </div>
                  <div>
                    Season
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.seasonName}
                  </div>
                  <div>
                    Mill 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.mill}
                  </div>
                  <div>
                    Fabric Content
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.fabricContent}
                  </div>
                  <div>
                    Fabric Count
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.fabricCount}
                  </div>
                  <div>
                    GSM
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.gsm}
                  </div>
                  <div>
                    FOB
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.fob}
                  </div>
                  <div>
                    Qty
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.quantity}
                  </div>
                  <div>
                    Location
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.locationName}
                  </div>
                  <div>
                    SMV 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                    {data[0]?.smv}
                  </div>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
