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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface CategoryFormProps {
  categoryData: categoryDto;
  updateDetails: (categoryData: categoryDto) => void;
  isUpdate: Boolean;
  closeForm: () => void;
}

export default function CategoryForm(props: CategoryFormProps) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const users: any = JSON.parse(localStorage.getItem('auth'));
  const createUser = users.userName;
  const [disable, setDisable] = useState<boolean>(false);

  function goToGrid() {
    navigate('/category-grid');
  }

  function onFinish(categoryData: categoryDto) {
    createCategory(categoryData)
      .then((res) => {
        if (res.status) {
          onReset();
          message.success(res.internalMessage, 2);
          navigate('/category-grid');
        } else {
          message.error(res.internalMessage, 2);
        }
      })
      .catch((err) => {
        setDisable(false);
        message.error('');
      });
  }

  const saveData = (values: categoryDto) => {
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
          initialValues={props.categoryData}
        >
          <Row gutter={24}>
            <Form.Item hidden name={'categoryId'}>
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
                label="Category"
                name={'categoryName'}
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
