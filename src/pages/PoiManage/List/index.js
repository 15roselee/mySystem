import React, { useEffect, useState } from 'react';
import {
  LeftOutlined,
  MenuOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  Col,
  Row,
  Button,
  Table,
  Input,
  Select,
  PageHeader,
  Tag,
  Space,
  Modal,
  Pagination,
} from 'antd';
import axios from 'axios';
import './index.css';

const { Option } = Select;
export default function PoiManageList() {
  //获取路由navigate
  const navigate = useNavigate();
  //开关店原始状态
  const [openStatus, SetOpenStatus] = useState(true);
  //获取门店目前状态
  const [shop, setShop] = useState([]);

  //列表数据
  const [data, setData] = useState([]);
  //门店数据总条数
  const [shopTotal, setShopTotal] = useState(1);
  //页数
  const [shopIndex, setShopIndex] = useState(1);
  //每页多少条数据
  const [shopSize, setShopSize] = useState(10);

  //取消对话框
  const [visible, setVisible] = useState(false);

  //表单验证
  const [form] = Form.useForm();

  //取消，确定（开关店）
  const hideModal = () => {
    setVisible(false);
  };
  const editEnabled = record => {
    setVisible(true);
    setShop(record);
  };

  useEffect(() => {
    queryShops();
  }, [shopIndex, shopSize]);

  //重置
  const  onReset=()=>{
    queryShops();
  }

  function queryShops(condition) {
    axios
      .post(
        'http://localhost:9102/shop/search',
        {
          condition,
          pageIndex: shopIndex,
          pageSize: shopSize,
          sortFields: [
            {
              asc: false,
              field: 'enabled',
            },
            {
              asc: false,
              field: 'last_modified_at',
            },
          ],
        },
        {
          headers: {
            tenantId: 500,
            userId: 11000,
          },
        }
      )
      .then(res => {
        console.log(res.data);
        setData(res.data.records);
        setShopTotal(res.data.totalCount);
      });
  }

  //门店分页，当前页数，每页条数
  const shopTabel = (current, pageSize) => {
    setShopIndex(current);
    setShopSize(pageSize);
  };

  //修改门店页码
  const EditShopSize = e => {
    setShopSize(Number(e.target.value));
  };

  const onFinish = async values => {
    const { enabled, businessTypes, managementTypes, keyword } = values;
    const conditions = {};
    if (enabled) {
      conditions.enabled = enabled;
    }
    if (businessTypes) {
      conditions.businessTypes = [businessTypes];
    }
    if (managementTypes) {
      conditions.managementTypes = [managementTypes];
    }
    if (keyword) {
      conditions.keyword = keyword;
    }
    await queryShops(conditions);
  };

  const onOkButton = () => {
    if (shop.enabled) {
      axios
        .post(
          `http://localhost:9102/shop/${shop.businessNo}/close`,

          {
            version: shop.version,
          },
          {
            headers: {
              tenantId: 500,
              userId: 11000,
            },
          }
        )
        .then();

      SetOpenStatus(!openStatus);
      setVisible(false);
    } else {
      axios
        .post(
          `http://localhost:9102/shop/${shop.businessNo}/open`,

          {
            version: shop.version,
          },
          {
            headers: {
              tenantId: 500,
              userId: 11000,
            },
          }
        )
        .then();

      SetOpenStatus(!openStatus);

      setVisible(false);
    }
  };

  const getFields = () => {
    return (
      <React.Fragment>
        <Col span={24}>
          <PageHeader
            className="site-page-header"
            ghost={false}
            onBack={() => navigate('/poi-manage/list')}
            title="门店管理"
            backIcon={<LeftOutlined />}
            extra={[
              <Button
                key="1"
                style={{
                  background: 'rgb(253, 200, 66)',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                }}
              >
                <Link to="/poi-manage/create">创建新门店</Link>
              </Button>,
              <span>{<MenuOutlined />}</span>,
            ]}
          />
        </Col>

        <Col span={8}>
          <Form.Item name={'enabled'} label={'启动状态'}>
            <Select>
              <Option value="">所有</Option>
              <Option value="true">营业中</Option>
              <Option value="false">停业中</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'businessTypes'} label={'营业状态'}>
            <Select>
              <Option value="">所有</Option>
              <Option value="DINNER">正餐</Option>
              <Option value="FAST_FOOD">快餐</Option>
              <Option value="HOT_POT">火锅</Option>
              <Option value="BARBECUE">烧烤</Option>
              <Option value="WESTERN_FOOD">西餐</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'managementTypes'} label={'管理类型'}>
            <Select>
              <Option value="">所有</Option>
              <Option value="DIRECT_SALES">直营</Option>
              <Option value="ALLIANCE">加盟</Option>
            </Select>
          </Form.Item>
        </Col>
      </React.Fragment>
    );
  };

  const columns = [
    {
      title: '营业状态',
      align: 'center',
      dataIndex: 'enabled',
      render: text =>
        text ? (
          <Tag color="yellow">营业中</Tag>
        ) : (
          <Tag color="yellow">停业中</Tag>
        ),
    },
    {
      title: '门店名',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '主营业态',
      align: 'center',
      dataIndex: 'businessType',
      render: text =>
        text === 'DINNER'
          ? '正餐'
          : text === 'FAST_FOOD'
          ? '快餐'
          : text === 'HOT_POT'
          ? '火锅'
          : text === 'BARBECUE'
          ? '烧烤'
          : '西餐',
    },
    {
      title: '管理类型',
      align: 'center',
      dataIndex: 'managementType',
      render: text => (text === 'ALLIANCE' ? '加盟' : '直营'),
    },
    {
      title: '营业时间',
      align: 'center',
      dataIndex: 'openingHours',
      render: text => (
        <Space>
          {text.openTime}~{text.closeTime}
        </Space>
      ),
    },
    {
      title: '营业面积',
      align: 'center',
      dataIndex: 'businessArea',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'enabled',

      render: (text, record) => (
        <Space>
          <span
            className="btn-primary-a"
            onClick={() => {
              navigate('/poi-manage/edit', {
                state: { datas: record },
                replace: true,
              });
            }}
          >
            编辑
          </span>
          <span className="btn-primary-a"> | </span>
          <span className="btn-primary-a" onClick={() => editEnabled(record)}>
            {record.enabled ? '停用' : '启用'}
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form
        form={form}
        name="search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
        initialValues={{
          businessTypes: '',
          managementTypes: '',
          enabled: '',
        }}
      >
        <Row gutter={24}>{getFields()}</Row>

        <Row>
          <Col span={16}>
            <Form.Item name={'keyword'} label={'门店名称'}>
              <Input
                rules={[{ max: 10, message: '最大长度为20位字符' }]}
                placeholder="请输入门店名称"
              />
            </Form.Item>
          </Col>

          <Col span={8} style={{ textAlign: 'right' }}>
            <Button htmlType="submit">查询</Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
                onReset();
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>

      <Table dataSource={data} columns={columns} pagination={false} />

      <Row>
        <Col span={20}>
          <Row className="my-pagination-left">
            <DoubleLeftOutlined />
            <Pagination
              size="small"
              total={shopTotal}
              pageSize={shopSize}
              defaultPageSize={shopSize}
              defaultCurrent={1}
              onChange={current => shopTabel(current, shopSize)}
              className="my-pageination"
            />
            <DoubleRightOutlined />
          </Row>
        </Col>

        <Col span={4}>
          <span>
            每页{' '}
            <Input
              className="form-control-yema"
              defaultValue={10}
              onChange={EditShopSize}
            />
            条记录
          </span>
        </Col>
      </Row>

      <Modal
        title={`${shop.enabled ? '停用' : '启用'}门店`}
        visible={visible}
        okText="确认"
        cancelText="取消"
        onCancel={hideModal}
        style={{ textAlign: 'center' }}
        footer={
          <React.Fragment>
            <Button
              style={{
                backgroundColor: '#FFC300',
                border: '0',
                width: '100px',
                marginRight: '80px',
              }}
              onClick={hideModal}
            >
              取消
            </Button>
            <Button
              style={{
                margin: '0 8px',
                width: '100px',
                marginRight: '90px',
              }}
              onClick={onOkButton}
            >
              确定
            </Button>
          </React.Fragment>
        }
      >
        <p>请确定是否需要{shop.enabled ? '停用' : '启用'}门店？</p>
      </Modal>
    </div>
  );
}
