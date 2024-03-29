import { Button, Card, Form, Input, notification } from 'antd';
import React from 'react';
// import './login2.css';
import './swatc-login.css'
import { useNavigate } from 'react-router-dom';
import { logIn } from 'libs/shared-services';
import image from '../../../../../../upload-files/AOB_SwatchBookPT4.webp'

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    logIn(values).then((res) => {
      console.log(res);
      if (res.data) {
        console.log(res);
        navigate('/', { replace: true });
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
    // <div className="login-page">
    //   <div className="light-effect"></div>
    //   <div className="login-form">
    //     {/* <div className="logo">sample</div> */}
    //     <div className="login-text">Login</div>
    //     <Form
    //       name="login"
    //       onFinish={onFinish}
    //       initialValues={{ remember: true }}
    //     >
    //       <Form.Item
    //         name="username"
    //         rules={[{ required: true, message: 'Please enter your username' }]}
    //       >
    //         <Input placeholder="Username" />
    //       </Form.Item>
    //       <Form.Item
    //         name="password"
    //         rules={[{ required: true, message: 'Please enter your password' }]}
    //       >
    //         <Input.Password placeholder="Password" />
    //       </Form.Item>
    //       <Form.Item>
    //         <Button
    //           className="login-button"
    //           htmlType="submit"
    //           style={{ color: 'whitesmoke' }}
    //         >
    //           Log in
    //         </Button>
    //       </Form.Item>
    //     </Form>
    //   </div>
    // </div>

    // 33333333333333333333333333333333333333333333333333333333333333333333333333333

<>
<div className="login-whole">
      <div className="login-section">
        <div className="login-antd">
          <h1 className="app-title">Digital Swatch Card</h1>
          <div className="login-form-container">
          <div className="login-header">
            {/* <div className="main-title">Log In</div> */}
          </div>
          <div className="login-form-antd">
            <Form
              name="login"
              onFinish={onFinish}
              initialValues={{ remember: true }}
              layout='vertical'
            >
              <Form.Item
                className="bold"
                name="username"
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input
                  className="input-field"
                  placeholder="Enter your username"
                  style={{ width: '100%', fontSize: '14px'}}
                />
              </Form.Item>
              <Form.Item
                className="bold"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  className="input-field"
                  placeholder="Enter your password"
                  style={{ width: '100%', fontSize: '14px'}}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  className="sign-in bold"
                  htmlType="submit"
                  style={{ width: '350px', fontSize: '14px' , height: '100%' }}
                >
                  Log In
                </Button>
              </Form.Item>
            </Form>
            </div>
          </div>
        </div>
      </div>

      <div className="image-holder">
        {/* <img src="https://images.unsplash.com/photo-1533158326339-7f3cf2404354?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80" alt="modern art" /> */}
        <img src={image} alt="modern art" />
      </div>
    </div>
</>






  );
}
{/* <body>
  <main className="login-whole">
    <div className="login-section">
      <div className="login">
        <div className="login-header">
          <div className="main-title">Log in</div>
                  </div>
        <div className="login-form">
          <form className="form" action="">
            <label className="bold">UserName</label>
            <input type="email" placeholder="Enter your username" required aria-required="true" />
            <label className="bold">Password</label>
            <input type="password" placeholder="Enter your password" required aria-required="true" />
            <input className="sign-in bold" type="submit" />
          </form>
        </div>
      </div>
    </div>
    <div className="image-holder">
      <img src="https://images.unsplash.com/photo-1533158326339-7f3cf2404354?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80" alt="modern art" />
    </div>
  </main>
</body> */}