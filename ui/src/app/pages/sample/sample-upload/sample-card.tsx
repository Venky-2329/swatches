import { Card, Col, Row, notification } from 'antd';
import Meta from 'antd/es/card/Meta';
import { getData } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import image from '../../../../assets/Picture1.png'

export default function SampleCards() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getSampleCards();
  }, []);

  console.log(data);

  function getSampleCards() {
    getData().then((res) => {
      if (res.data) {
        setData(res.data);
        notification.success({ message: res.internalMessage });
      } else {
        notification.error({ message: res.internalMessage });
      }
    });
  }

  return (
    <>
      <Row gutter={[24,24]}>
        {data.map((i) => {
          const { brandId, styleNo, gsm} = i;
          return (
            <Col span={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt="example"
                    src={image}

                  />
                }
              >
                <Meta
                  title="Sample Item Details"
                  description={
                    <>
                    <div>Brand Name:{brandId}</div>
                    <div>GSM:{gsm}</div>
                    </>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
