import { Form, Input, Button, Checkbox } from 'antd';
import React, { useState } from 'react';
import './index.css'
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const Demo = () => {
  const [componentSize, setComponentSize] = useState('default');
  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  

  return (
    <div className='formFile'>
    <Form
      name="basic"
      layout="horizontal"
      labelCol={{
        span: 15,
        // <UserOutlined />
        
      }}
      wrapperCol={{
        span: 30,
      }}
      initialValues={{
        size: componentSize,
      }}
      
      onValuesChange={onFormLayoutChange}
      size={componentSize}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      // autoComplete="off"
    >
      <Form.Item
        // label="Username"
        name="username"
        label="{<UserOutlined />}"
        value="large"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
        // {<UserOutlined />}
        
      >
        
        {/* <Input /> */}
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        
      >
        {/* <Input.Password /> */}
      </Form.Item>

      <Form.Item
        name="remember"
        size="large"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <p>tips:请勿多次登录！</p>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default Demo;
