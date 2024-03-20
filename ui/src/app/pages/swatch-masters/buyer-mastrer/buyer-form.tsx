import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  message,
} from 'antd';
import { BuyerDto } from 'libs/shared-models';
import { BuyerService } from 'libs/shared-services';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface BuyerFormProps {
  buyerData: BuyerDto;
  updateDetails: (buyerData: BuyerDto) => void;
  isUpdate: Boolean;
  closeForm: () => void;
}

export default function BuyerForm(props: BuyerFormProps) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const users: any = JSON.parse(localStorage.getItem('auth'));
  const createUser = users.userName;
  const [disable, setDisable] = useState<boolean>(false);
  const service = new BuyerService()

  function goToGrid() {
    navigate('/buyer-grid');
  }

  function onFinish(buyerData: BuyerDto) {
    console.log(buyerData);
    
    service.createBuyer(buyerData)
      .then((res) => {
        if (res.status) {
          onReset();
          message.success(res.internalMessage, 2);
          navigate('/buyer-grid');
        } else {
          message.error(res.internalMessage, 2);
        }
      })
      .catch((err) => {
        setDisable(false);
        message.error('');
      });
  }

  const saveData = (values: BuyerDto) => {
    setDisable(false);
    if (props.isUpdate) {
      console.log(values,'----------------')
      props.updateDetails(values);
    } else {
      onFinish(values);
      setDisable(false);
    }
  };

  function onReset() {
    form.resetFields();
  }

  return (
    <>
      <Card
        title="Buyer Form"
        extra={
          <span>
            {props.isUpdate == false && (
              <Button onClick={goToGrid} type="primary">
                View
              </Button>
            )}
          </span>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveData}
          initialValues={props.buyerData}
        >
          <Row gutter={24}>
            <Form.Item hidden name={'buyerId'}>
              <Input />
            </Form.Item>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Buyer"
                name={'buyerName'}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Form.Item hidden name={'createdUser'} initialValue={createUser}>
              <Input defaultValue={createUser} />
            </Form.Item>
            <Col
              xs={{ span: 6 }}
              sm={{ span: 6 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 2 }}
            >
              <Button
                style={{ marginTop: '23px' }}
                htmlType="submit"
                type="primary"
              >
                Submit
              </Button>
            </Col>
            <Col
              xs={{ span: 6 }}
              sm={{ span: 6 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 1 }}
            >
              {props.isUpdate == false && (
                <Button style={{ marginTop: '23px' }} onClick={onReset}>
                  Reset
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
