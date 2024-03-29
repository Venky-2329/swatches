import { Button, Card, Col, Form, Row, Select, Table, message } from 'antd';
import { TrimSwatchService } from 'libs/shared-services';
import { title } from 'process';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const TrimSwatchGrid = () => {
  const Option = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const service = new TrimSwatchService();

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = () => {
    service.getAllTrimSwatchData().then((res) => {
      if (res.status) {
        setData(res.data);
        message.success(res.internalMessage);
      } else {
        setData([]);
        message.error(res.internalMessage);
      }
    });
  };

  const columns: any = [
    {
      title: 'S.No',
      render: (val, record, index) => index + 1,
    },
    {
      title: 'Trim Number',
      dataIndex: 'trim_swatch_number',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (createdAt) => {
        const date = new Date(createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
    {
      title: 'GRN Number',
      dataIndex: 'grn_number',
    },
    {
      title: 'GRN Date',
      dataIndex: 'grn_date',
      render: (grnDate) => {
        const date = new Date(grnDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
    {
      title: 'Buyer',
      dataIndex: 'buyerName',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
    },
    {
      title: 'Po No',
      dataIndex: 'po_number',
    },
    {
      title: 'Style No',
      dataIndex: 'style_no',
    },
    {
      title: 'Item No',
      dataIndex: 'item_no',
    },
    {
      title: 'Item Descrpition',
      dataIndex: 'item_description',
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    // },
  ];

  function gotoGrid() {
    navigate('/trims-swatch-upload');
  }

  return (
    <>
      <Card
        title="Trim Swatch"
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        extra={
          <span style={{ color: 'white' }}>
            <Button onClick={gotoGrid}>Create</Button>{' '}
          </span>
        }
      >
        <Form form={form} layout="vertical">
          <Row>
            <Col xs={24} sm={24} md={6} lg={4} xl={4}>
              <Form.Item name={'trimSwatchNumber'} label={'Trim No'}>
                <Select allowClear placeholder="Select Trim No">
                  {data.map((item) => {
                    return (
                      <Option
                        key={item.trimSwatchId}
                        value={item.trim_swatch_number}
                      >
                        {item.trim_swatch_number}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>
    </>
  );
};
