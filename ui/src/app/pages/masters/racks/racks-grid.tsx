import { Button, Card, Col, Form, Input, Row, Table } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function RacksGrid() {
  const [page, setPage] = React.useState(1);
  const [data, setData] = useState([]);

  const columns = [
    {
      title: 'S.no',
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
    },
    {
        title:'Rack Name',
        dataIndex:'rackName'
    }
  ];
  return (
    <>
      <Card
        title="Racks"
        extra={
          <Link to="/racks-form">
            <span style={{ color: 'white' }}>
              <Button>New </Button>{' '}
            </span>
          </Link>
        }
      >
        <Table columns={columns} dataSource={data}></Table>
      </Card>
    </>
  );
}
export default RacksGrid;
