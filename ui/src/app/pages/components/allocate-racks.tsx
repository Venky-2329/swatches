import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Row,
  Select,
  Table,
  notification,
} from 'antd';
import { getRacksData, updateRackStatus } from 'libs/shared-services';
import React, { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { ScanOutlined } from '@ant-design/icons';
import { RackStatus, RackStatusEnum } from 'libs/shared-models';

export default function AllocateRacks() {
  const Option = Select;
  const [form] = Form.useForm();
  const [formRef] = Form.useForm();
  const [racks, setRacks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    racksDropDown();
  }, []);

  function handleScan(data) {
    console.log(data)
    if (data) {
      setResult(data.text);
      setVisible(false);
    }
  }

  const handleError = (err) => {
    console.error(err);
    setVisible(false);
  };

  console.log(result);

  function racksDropDown() {
    getRacksData().then((res) => {
      if (res.data) {
        setRacks(res.data);
      }
    });
  }

  function modalVisible() {
    setVisible(true);
    setResult(null);
  }
  function closeModal() {
    setVisible(false);
  }

  function updateRack(val) {
    const req = new RackStatus()
    req.rackStatus = val;
    req.racksId = formRef.getFieldValue('subRackId')
    updateRackStatus(req).then((res) => {
      console.log(res)
      if (res.status) {
        formRef.resetFields()
        notification.success({ message: res.internalMessage });
      } else {
        notification.success({ message: res.internalMessage });
      }
    });
  }

  return (
    <>
      <Card>
        <Row gutter={24} justify={'center'}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 4 }}
            style={{ display: visible == true ? 'none' : 'block' }}>
            <Button onClick={modalVisible} style={{ width: '100px', height: '50px' }}>
              <b>SCAN</b> {<ScanOutlined />}
            </Button>
          </Col>
          {visible ? (
            <>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 4 }}>
                <QrScanner
                  // delay={300}
                  value={result}
                  onError={handleError}
                  onScan={(data) => handleScan(data)}
                  style={{ width: '100%' }}
                />
              </Col>
            </>
          ) : (
            <></>
          )}
        </Row>
      </Card>
      <br></br>
      <Card hidden={result == null ? true : false}>
        <br></br>
        <Row gutter={24}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 6 }}>
            <div style={{ marginTop: '16px' }}>
              {result && <p>Scanned QR Code: {result}</p>}
            </div>
          </Col>
        </Row>
        <Form form={formRef} layout="vertical">
          <Row gutter={24}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 4 }}>
              <Form.Item label="Rack" name={'subRackId'}>
                <Select placeholder='Select Rack' allowClear style={{ width: '160px' }}>
                  {racks.map((e) => {
                    return (
                      <Option value={e.subRackId} key={e.subRackId}>
                        {e.rack}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 2 }} >
              <Button style={{ marginTop: '25px' }} onClick={e => updateRack(RackStatusEnum.PARTIALLY_OCCUPIED)}>Partially</Button>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 3 }}>
              <Button style={{ marginTop: '25px' }} onClick={e => updateRack(RackStatusEnum.FULLY_OCCUPIED)}>Fully</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
