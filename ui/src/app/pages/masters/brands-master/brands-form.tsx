import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function BrandsForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  function goToGrid() {
    navigate('/brands-grid');
  }

  function onFinish() {}

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
            <Col span={4}>
              <Form.Item label="Brand Name" name={'brandName'}>
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
