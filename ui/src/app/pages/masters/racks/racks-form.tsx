import { Button, Card, Col, Form, Input, Row } from 'antd';
import { Link } from 'react-router-dom';

export function RacksForm() {
  const [form] = Form.useForm();

  function onReset() {
    form.resetFields();
  }
  function onSubmit(values) {
    console.log(values);
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
        <Form form={form} onFinish={onSubmit}>
          <Row gutter={24}>
            <Col span={4}>
              <Form.Item name={'rackName'} label="Rack Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Col>
            <Col span={3}>
              <Button onClick={onReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
export default RacksForm;
