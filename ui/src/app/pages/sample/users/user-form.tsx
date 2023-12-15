import { Button, Card, Col, Form, Input, Row, notification } from 'antd';
import { createSeason, createUser } from 'libs/shared-services';
import { useNavigate } from 'react-router-dom';

export default function UserForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const users: any = JSON.parse(localStorage.getItem('auth'))
  const createdUser = users.userName

  function goToGrid() {
    navigate('/user-grid');
  }

  function onFinish(values) {
    createUser(values).then((res)=>{
        if(res.status){
          onReset()
           notification.success({message:res.internalMessage})
           navigate('/user-grid');
        }else{
          notification.error({message:res.internalMessage})
        }
    })
  }

  function onReset() {
    form.resetFields();
  }

  return (
    <>
      <Card
        title="User Creation"
        extra={
          <span>
            <Button onClick={goToGrid} type="primary">
              View
            </Button>
          </span>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
              <Form.Item label="User Name" name={'userName'}
              rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
              <Form.Item label="Password" name={'password'}
              rules={[{ required: true }]}>
                <Input min={8}/>
              </Form.Item>
            </Col>
            <Form.Item hidden name={'createdUser'} initialValue={createdUser}><Input defaultValue={createdUser}/></Form.Item>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 2}}>
              <Button style={{marginTop:'23px'}} htmlType="submit" type="primary">
                Submit
              </Button>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
              <Button  style={{marginTop:'23px'}} onClick={onReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
