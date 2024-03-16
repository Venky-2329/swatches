import { Button, Form, Input, notification } from 'antd';
import React from 'react';
import './login2.css';
import { useNavigate } from 'react-router-dom';
import { logIn } from 'libs/shared-services';

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    logIn(values).then((res) => {
      console.log(res);
      if (res.data) {
        console.log(res);
        navigate('/home-screen', { replace: true });
        localStorage.setItem('auth', JSON.stringify(res.data));
        notification.success({
          message: res.internalMessage,
          placement: 'top',
          duration: 1,
        });
      } else {
        notification.error({
          message: res.internalMessage,
          placement: 'top',
          duration: 1,
        });
      }
    });
  };
  return (
    <div className="login-page">
      <div className="light-effect"></div>
      <div className="login-form">
        {/* <div className="logo">sample</div> */}
        <div className="login-text">Login</div>
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              className="login-button"
              htmlType="submit"
              style={{ color: 'whitesmoke' }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
