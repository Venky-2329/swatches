import { Button, Card, Col, Form, Input, Row, notification } from 'antd';
import { SeasonDto } from 'libs/shared-models';
import { createSeason } from 'libs/shared-services';
import { useNavigate } from 'react-router-dom';

export interface SeasonFormProps {
  seasonData: SeasonDto;
  isUpdate: Boolean;
  updateDetails: (seasonData: SeasonDto) => void;
  closeForm: () => void;
}

export default function SeasonForm(props: SeasonFormProps) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const users: any = JSON.parse(localStorage.getItem('auth'));
  const createUser = users.userName;

  function goToGrid() {
    navigate('/season-grid');
  }

  function onFinish(values: SeasonDto) {
    createSeason(values).then((res) => {
      if (res.status) {
        onReset();
        notification.success({
          message: res.internalMessage,
          placement: 'top',
          duration: 1,
        });
        navigate('/season-grid');
      } else {
        notification.error({
          message: res.internalMessage,
          placement: 'top',
          duration: 1,
        });
      }
    });
  }

  const saveData = (values: SeasonDto) => {
    if (props.isUpdate) {
      props.updateDetails(values);
    } else {
      onFinish(values);
    }
  };

  function onReset() {
    form.resetFields();
  }

  return (
    <>
      <Card
        title="Season Form"
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
          initialValues={props.seasonData}
        >
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Season"
                name={'seasonName'}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Form.Item hidden name={'seasonId'} >
              <Input  />
            </Form.Item>
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
              <Button style={{ marginTop: '23px' }} onClick={onReset}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
