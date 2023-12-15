import { Button, Card, Col, Form, Input, Row, notification } from 'antd';
import { createBrands } from 'libs/shared-services';
import { useNavigate } from 'react-router-dom';

export default function BrandsForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const createUser: any = JSON.parse(localStorage.getItem('auth'))
  const user = createUser.userName

  function goToGrid() {
    navigate('/brands-grid');
  }

  function onFinish(values) {
    createBrands(values).then((res)=>{
        if(res.status){
          onReset()
           notification.success({message:res.internalMessage})
           navigate('/brands-grid');
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
        title="Brands Form"
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
            <Col span={4}>
              <Form.Item label="Brand Code" name={'brandCode'}>
                <Input />
              </Form.Item>
            </Col>
            <Form.Item hidden name={'createdUser'} initialValue={user}><Input defaultValue={user}/></Form.Item>
            <Col span={4}>
              <Form.Item label="Brand Name" name={'brandName'}rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Button style={{marginTop:'23px'}} htmlType="submit" type="primary">
                Submit
              </Button>
            </Col>
            <Col>
              <Button  style={{marginTop:'23px'}} onClick={onReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
