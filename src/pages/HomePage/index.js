import { Layout, Menu, Pagination, Badge } from 'antd';
import React, { useState } from 'react';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import PoiManageEdit from '../PoiManage/Edit';
import PoiManageList from '../PoiManage/List';
import PoiManageCreate from '../PoiManage/Create';

import FoodManageList from '../FoodManage/List';
import FoodManageCreate from '../FoodManage/Create';
import FoodManageEdit from '../FoodManage/Edit';

import OrderManageList from '../OrderManage/List';
import OrderManageOrder from '../OrderManage/Order';
import OrderManageMake from '../OrderManage/Make';
import OrderManageAccount from '../OrderManage/Account';
import OrderManageOutFood from '../OrderManage/OutFood';
import OrderManageChange from '../OrderManage/Change';
import OrderManageCheck from '../OrderManage/Check';

import LoginRegisterLogin from '../Login/RegisterLogin';
import HomePage from '../HomePage';

import './index.css';

const { Header, Sider, Content } = Layout;

export default function Home() {
  /**
   * 侧边栏展开和关闭
   */

  const [collapsed, setCollspsed] = useState(false);
  const onCollapse = collapsed => {
    setCollspsed(collapsed);
  };

  return (
    <Layout>
      <Sider
        style={{ height: '100%' }}
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        collapsible="true"
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo"></div>

        <Menu theme="light" mode="inline" defaultSelectedKeys={['true']}>
          <Menu.Item key="2" icon={<UserOutlined />}>
          
            <Link to="/poi-manage/list">门店管理</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<VideoCameraOutlined />}>
            <Link to="/food-manage/list">菜品管理</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UploadOutlined />}>
            <Link to="/order-manage/list">订单管理</Link>
          </Menu.Item>
        </Menu>
        <span className="breadcrumb">{<MenuFoldOutlined />}收起导航栏</span>
      </Sider>

      <Layout className="site-layout" theme="light">
        <Header
          className="site-layout-background"
          style={{ padding: 0 }}
          theme="light"
        >
          <div>
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">运营中心</Menu.Item>
            </Menu>
          </div>

          <div style={{ float: 'right', marginRight: '100px' }}>
            <span style={{ marginRight: '40px' }}>消息</span>
            <span>帮助</span>
            <Badge
              dot
              style={{
                position: 'absolute',
                top: '-91px',
                right: '75px',
              }}
            >
              <BellOutlined
                style={{
                  position: 'absolute',
                  top: '-91px',
                  right: '75px',
                }}
              />
            </Badge>

            <QuestionCircleOutlined
              style={{
                position: 'absolute',
                top: '15px',
                right: '111px',
              }}
            />
          </div>
        </Header>

        <Content
          className="site-layout-background"
          style={{
            margin: '6px 0px 0px 0px',
            padding: 24,
            height: '90vh',
            overflow: 'scroll',
          }}
        >
          {/* <FoodManageList /> */}

          <Routes>
            <Route path="/" element={<PoiManageList />} />
            <Route path="/poi-manage">
              <Route path="edit" element={<PoiManageEdit />} />
              <Route path="list" element={<PoiManageList />} />
              <Route path="create" element={<PoiManageCreate />} />
            </Route>
            <Route path="/food-manage">
              <Route path="list" element={<FoodManageList />} />
              <Route path="create" element={<FoodManageCreate />} />
              <Route path="edit" element={<FoodManageEdit />} />
            </Route>

            <Route path="/order-manage">
              <Route path="list" element={<OrderManageList />} />
              <Route path="order" element={<OrderManageOrder />} />
              <Route path="make" element={<OrderManageMake />} />
              <Route path="account" element={<OrderManageAccount />} />
              <Route path="outfood" element={<OrderManageOutFood />} />
              <Route path="change" element={<OrderManageChange />} />
              <Route path="check" element={<OrderManageCheck />} />
            </Route>
            <Route path="/login-register-login" element={<LoginRegisterLogin />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
