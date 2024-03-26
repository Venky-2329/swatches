import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  message,
  notification,
} from 'antd';
import { BrandDto } from 'libs/shared-models';
import { createBrands } from 'libs/shared-services';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface BrandsFormProps {
  brandData: BrandDto;
  updateDetails: (brandData: BrandDto) => void;
  isUpdate: Boolean;
  closeForm: () => void;
}

export default function BrandsForm(props: BrandsFormProps) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const createUser: any = JSON.parse(localStorage.getItem('auth'));
  const user = createUser.userName;
  const [disable, setDisable] = useState<boolean>(false);

  function goToGrid() {
    navigate('/brands-grid');
  }

  function onFinish(brandData: BrandDto) {
    createBrands(brandData)
      .then((res) => {
        if (res.status) {
          onReset();
          notification.success({ message: res.internalMessage });
          navigate('/brands-grid');
        } else {
          notification.error({ message: res.internalMessage });
        }
      })
      .catch((err) => {
        setDisable(false);
        message.error('');
      });
  }

  const saveData = (values: BrandDto) => {
    setDisable(false);
    if (props.isUpdate) {
      props.updateDetails(values);
    } else {
      onFinish(values);
      setDisable(false);
    }
  };

  function onReset() {
    form.resetFields();
  }
  console.log(props.brandData);
  return (
    <>
      <Card
        title="Brands"
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        extra={
          <span>
            {props.isUpdate !== true && (
              <Button onClick={goToGrid}>
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
          initialValues={props.brandData}
        >
          <Row gutter={24}>
            {/* <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}> */}
            {/* <Form.Item label="Brand Code" name={'brandCode'}>
                <Input />
              </Form.Item> */}
            {/* </Col> */}
            <Form.Item hidden name={'createdUser'} initialValue={user}>
              <Input defaultValue={user} />
            </Form.Item>
            <Form.Item hidden name={'brandId'}>
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
                label="Brand Name"
                name={'brandName'}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
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
              {props.isUpdate !== true && (
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
