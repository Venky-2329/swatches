import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  QRCode,
  Row,
  Select,
  Table,
  notification,
} from 'antd';
import { getRacksData } from 'libs/shared-services';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './print.css'
import ReactDOM from 'react-dom';

export default function CutSummary() {
  const Option = Select;
  const [form] = Form.useForm();
  const [formRef] = Form.useForm();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [visible, setVisible] = useState(false);

  const dataSource = [
    {
      itemNo: 'item -1',
      poNo: 'PO-07-01',
      qty: '65',
      color: 'INDIGO',
      destination: 'US',
      shrinkage: '5*5',
      sizes: 49,
    },
    {
      itemNo: 'item -2',
      poNo: 'PO-07-02',
      qty: '68',
      color: 'BLACK',
      destination: 'US',
      shrinkage: '5*5',
      sizes: 30,
    },
  ];
  const popData = [<p>Sizes :{dataSource[0].sizes}</p>];

  function modalVisible() {
    setVisible(true);
  }
  function closeModal() {
    setVisible(false);
  }

  function navigateToAllocate() {
    navigate('/allocate-rack');
  }

  const columns = [
    {
      title: 'S.no',
      // render: (v: any, r: any, i: number) => i + 1
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
    },
    {
      title: 'Item No',
      dataIndex: 'itemNo',
    },
    {
      title: 'Po No',
      dataIndex: 'poNo',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      render: (value) => {
        return (
          <>
            <Popover content={popData}>{value}</Popover>
          </>
        );
      },
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
    },
    {
      title: 'Shrinkage',
      dataIndex: 'shrinkage',
    },
    {
      title: 'Action',
      render: () => {
        return (
          <Button type="primary" onClick={modalVisible}>
            Generate Bar Code
          </Button>
        );
      },
    },
  ];

  const print =()=>{
    return `
    <html>
                <body id="printme">
                  <table>
                    <tr>${currentDate}</tr>
                    <div>
                        ${<QRCode value={'Qr scanned successfully'} type='svg' />}
                      </div>
                    <tr>
                      <p>25228-22201</p>
                    </tr>
                    <tr>
                      <p>TOMMY</p>
                    </tr>
                    <tr>
                      <p>76J2771 - 4300029186</p>
                    </tr>
                    <tr>
                      <p>INDIGO</p>
                    </tr>
                    <tr>
                      <p>B/OUT CAR</p>
                      <p>2/201</p>
                      <p>22201</p>
                      <p>1</p>
                    </tr>
                  </table>
                </body>
              </html>
    `
  }

  const printOrder = () => {
    const element = window.open('', '', 'height=700, width=1024');
    element.document.write('<html><head><title>-</title></head><body>');
    const printContent = print();
    element.document.write(printContent);
    element.document.write('</body></html>');
    element.document.close();

    element.print();
    element.close();

    // const divContents = document.getElementById('printme').innerHTML;
    // element.document.write(divContents);
    // element.document.write('</body></html>');
    // element.document.close();
    // setTimeout(()=>{
    //   element.print();
    //   element.close();
    // },1000)
  };

  const currentDate = new Date().toDateString();
  console.log(currentDate);
  return (
    <>
      <Card>
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 4 }}
            >
              <Form.Item label="Item No" name={'itemNo'}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 4 }}
            >
              <Form.Item label="Buyer Po" name={'buyerPo'}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 4 }}
            >
              <Form.Item label="Color" name={'color'}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 4 }}
            >
              <Form.Item label="Batch No" name={'batchNo'}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 4 }}
            >
              <Form.Item label="Destination" name={'destination'}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 2 }}
            >
              <Button style={{ marginTop: '25px' }} type="primary">
                Submit
              </Button>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 3 }}
            >
              <Button style={{ marginTop: '25px' }}>Reset</Button>
            </Col>
          </Row>
        </Form>
        <br></br>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          visible={visible}
          onCancel={closeModal}
          width={250}
          footer={false}
        >
          <Button onClick={printOrder}>Print</Button>
          <Card>
            <div>
              <html>
                <body id="printme">
                  <table>
                    <tr>{currentDate}</tr>
                    <tr>
                      <div>
                        <QRCode value={'Qr scanned successfully'} type='canvas'/>
                      </div>
                    </tr>
                    <tr>
                      <p>25228-22201</p>
                    </tr>
                    <tr>
                      <p>TOMMY</p>
                    </tr>
                    <tr>
                      <p>76J2771 - 4300029186</p>
                    </tr>
                    <tr>
                      <p>INDIGO</p>
                    </tr>
                    <tr>
                      <p>B/OUT CAR</p>
                      <p>2/201</p>
                      <p>22201</p>
                      <p>1</p>
                    </tr>
                  </table>
                </body>
              </html>
            </div>
          </Card>
        </Modal>
      </Card>
    </>
  );
}
