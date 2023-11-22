import { Card } from 'antd';

export default function RacksDashboard() {
  const data = [
    {
      rackName: 'RACK 1',
      columns: 2,
      rows: 2,
      rackDetails: [
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
    <>
      <Card>
         
      </Card>
    </>
  );
}
