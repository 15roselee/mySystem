// import React, { useEffect, useState } from 'react';
// import {
//   Form,
//   Tag,
//   Col,
//   Row,
//   Button,
//   Pagination,
//   Input,
//   Select,
//   PageHeader,
//   Modal,
//   Space,
//   Table,
//   message,
//   InputNumber,
// } from 'antd';
// import axios from 'axios';
// import {
//   LeftOutlined,
//   MenuOutlined,
//   MinusCircleOutlined,
//   PlusCircleOutlined,
// } from '@ant-design/icons';
// import { useNavigate, useLocation } from 'react-router-dom';
// import 'moment/locale/zh-cn';
// import moment from 'moment';
// import Background from '../Home/image/6.webp';
// const { Option } = Select;
// import { Input } from 'antd';
// import { UserOutlined } from '@ant-design/icons';

import { Layout, Input, Button } from 'antd';

import React, { useState } from 'react';

import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './indexGood.css';
import Password from 'antd/lib/input/Password';

const { Content } = Layout;

//   //表单验证

//   // return (
//   //   <div>
//   //     <Form
//   //       form={form}
//   //       onFinish={onFinish}
//   //       name="advanced_search"
//   //       className="ant-advanced-search-form"
//   //     >
//   //       <Row gutter={24}>{getFields()}</Row>
//   //     </Form>
//   //   </div>
//   // );
//   // }



export default function Home() {
  // 受控主键
  //表单验证
  
  const onSubmit=()=>{

  }
  
 

 
  return (
    <Layout>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flex: 'auto',
          // background: #fff ,url("../Home/image/6.png") no-repeat ,
        }}
       
      >
       
        <form className="inputbox" >
          <span className="text">点单系统</span>
          <br />
          <div className="line"></div>

          <Input
       
          className='username'
          size="large"
            placeholder="请输入用户名"
            type="text"
            name="username"
            bordered
            // bordered:true
            prefix={<UserOutlined 
              style={{               
                fontSize:'25px'
              }}/>}
            style={{ width: '360px'
        
          }}
          />
          <br />
          <br />

          <Input
          
          className='password'
          size="large"
            placeholder="请输入密码"
            type="number"
            name="password"
            prefix={<LockOutlined
              style={{               
                fontSize:'25px'
              }}
            />}
            style={{ width: '360px' }}
          />
          <br />
          <br />

          <Button
            type="primary"
            style={{
              width: '360px'
              
            }}
            
          >
            登录
          </Button>
          <br/>
          <p>tips:请勿多次登录！</p>
        </form>
      </Content>
    </Layout>
  );
}
