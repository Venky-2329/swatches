import { Button, Card, Col, Form, Input, InputNumber, Row, Table, notification } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import{RacksDto} from 'libs/shared-models';
import {saveRacks} from 'libs/shared-services';

export function RacksForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [tableConfig, setTableConfig] = React.useState({
    columns: [],
    data: [],
  });
  const [rackName,setRackName] = useState('')

  function onReset() {
    form.resetFields();
    setRackName('')
    setTableConfig({
      columns: [],
      data: [],
    });
  }
  function onSubmit(values:RacksDto) {
    const combinedValues = { ...values, tableData: tableConfig.data };
    console.log(combinedValues)
    saveRacks(combinedValues).then((res)=>{
      if(res.status){
        notification.success({message:res.internalMessage})
        onReset();
        navigate('/racks-grid');
      }else{
        notification.error({message:res.internalMessage})
      }
    })
  }

  function onColumnChange(value) {
    const columns = Array.from({ length: value }, (_, index) => ({
      dataIndex: `input${index + 1}`,
      render: (_, record) => <Input value={`C${index + 1}R${record.key}`} placeholder={`${rackName}-C${index + 1}R${record.key}`} disabled /> ,
    }));
    setTableConfig((prevConfig) => ({
      ...prevConfig,
      columns,
    }));
  }
  

  function onRowChange(value) {
    const data = Array.from({ length: value }, (_, rowIndex) => {
      const rowData = { key: `${rowIndex + 1}` };
      for (let columnIndex = 0; columnIndex < tableConfig.columns.length; columnIndex++) {
        rowData[`input${columnIndex + 1}`] = `C${columnIndex + 1}R${rowIndex + 1}`;
      }
      return rowData;
    });

    setTableConfig((prevConfig) => ({
      ...prevConfig,
      data,
    }));
  }

  function rackOnChange(val){
    setRackName(val)
  }

  return (
    <>
      <Card title='Rack Creation'
      extra={
        <Link to="/racks-grid">
          <span style={{ color: 'white' }}>
            <Button>View </Button>{' '}
          </span>
        </Link>
      }>
        <Form form={form} onFinish={onSubmit} layout='vertical'>
          <Row gutter={24}>
            <Col span={3}>
              <Form.Item name={'rackName'} label='Rack Name'>
                 <Input onChange={e => rackOnChange(e.target.value)}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name={'columns'} label="Column">
                <InputNumber min={0} onChange={onColumnChange}/>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name={'rows'} label="Rows">
                <InputNumber min={0} onChange={onRowChange}/>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Button style={{marginTop:'30px'}} type="primary" htmlType="submit">
                Submit
              </Button>
            </Col>
            <Col span={3}>
              <Button style={{marginTop:'30px'}} onClick={onReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
        <br></br>
        <Card title={<h1>{rackName}</h1>} style={{textAlign:'center'}}>
        <Table bordered columns={tableConfig.columns} dataSource={tableConfig.data} pagination={false}/>
        </Card>
      </Card>
    </>
  );
}
export default RacksForm;
