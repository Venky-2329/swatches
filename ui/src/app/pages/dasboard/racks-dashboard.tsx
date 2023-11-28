import { Card, Col, Row, Statistic } from 'antd';
import MainRackCard from '../warehouse-dashboard/main-rack';
import RackCard from '../warehouse-dashboard/rack-card';
import { PageContainer } from '@ant-design/pro-components'


export default function RacksDashboard() {
  const data = [
    {
      rackName: 'RACK 1',
      columns: 3,
      rows: 2,
      rackDetails: [
        {
          subRack: 'RACK 1 C1R1',
          status: 'Partially',
          qty: 60,
        },
        {
          subRack: 'RACK 1 C1R1',
          status: 'Partially',
          qty: 60,
        },
        {
          subRack: 'RACK 1 C1R1',
          status: 'Partially',
          qty: 60,
        },
        {
          subRack: 'RACK 1 C1R2',
          status: 'Fully',
          qty: 60,
        },
        {
          subRack: 'RACK 1 C2R1',
          status: 'Empty',
          qty: 60,
        },
        {
          subRack: 'RACK 1 C2R2',
          status: 'Empty',
          qty: 60,
        },
      ],
    },
    {
      rackName: 'RACK 2',
      columns: 2,
      rows: 2,
      rackDetails: [
        {
          subRack: 'RACK 2 C1R1',
          status: 'Partially',
          qty: 60,
        },
        {
          subRack: 'RACK 2 C1R2',
          status: 'Fully',
          qty: 60,
        },
        {
          subRack: 'RACK 2 C2R1',
          status: 'Empty',
          qty: 60,
        },
        {
          subRack: 'RACK 2 C2R2',
          status: 'Empty',
          qty: 60,
        },
      ],
    },
  ];

  return (
    <PageContainer title={'Cutting Inventory'}
      extra={
        <>
          <div style={{paddingRight:'15px'}}>
            <Statistic title="Total Qty" value={400} />
          </div>
          <div style={{paddingRight:'15px'}}>
            <Statistic title="Stock In Qty" value={1000} />
          </div>
          <div style={{paddingRight:'15px'}}>
            <Statistic title="Stock Out Qty" value={600} />
          </div>
        </>
      }>
      <Row gutter={24}>

        {
          data.map((v, i) => {
            const lgSpan = (v.columns * 4)
            return <Col xs={{ span: 22 }}
              sm={{ span: 22 }}
              md={{ span: 11 }}
              lg={{ span: lgSpan }}
              xl={{ span: lgSpan }}>
              <RackCard index={i} racks={v} />
            </Col>
          })
        }

      </Row>
    </PageContainer>
  );
}
