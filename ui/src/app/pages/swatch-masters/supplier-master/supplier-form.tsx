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
import { supplierDto } from 'libs/shared-models';
import { SupplierService } from 'libs/shared-services';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  
  export interface SupplierFormProps {
    supplierData: supplierDto;
    updateDetails: (supplierData: supplierDto) => void;
    isUpdate: Boolean;
    closeForm: () => void;
  }
  
  export default function SupplierForm(props: SupplierFormProps) {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const users: any = JSON.parse(localStorage.getItem('auth'));
    const createUser = users.userName;
    const [disable, setDisable] = useState<boolean>(false);
    const service = new SupplierService()
  
    function goToGrid() {
      navigate('/supplier-grid');
    }

    function onReset() {
      form.resetFields();
    }
  
    function onFinish(supplierData: supplierDto) {
      service.createSupplier(supplierData)
        .then((res) => {
          if (res.status) {
            onReset();
            message.success(res.internalMessage,2);
            navigate('/supplier-grid');
          } else {
            message.error(res.internalMessage,2)
          }
        })
        .catch((err) => {
          setDisable(false);
          message.error('');
        });
    }
  
    const saveData = (values: supplierDto) => {
      setDisable(false);
      if (props.isUpdate) {
        props.updateDetails(values);
      } else {
        onFinish(values);
        setDisable(false);
      }
    };
  

    return (
      <>
        <Card
          title="Supplier Form"
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
            initialValues={props.supplierData}
          >
            <Row gutter={24}>
              <Form.Item hidden name={'supplierId'}>
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
                  label="Supplier"
                  name={'supplierName'}
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
  