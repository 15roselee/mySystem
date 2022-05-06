import React, { useEffect, useState } from 'react';
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
  message,
  Pagination,
} from 'antd';
import axios from 'axios';
import { LeftOutlined, MenuOutlined,DoubleLeftOutlined,DoubleRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const { Option } = Select;
export default function FoodManageList() {
  //菜品数据
  const [data, setData] = useState([]);
  //路由跳转
  const navigate = useNavigate();
  //获取上下架状态
  const [putaway, setPutaway] = useState([]);
  //修改上下架
  const [up, setUp] = useState(true);
  //弹窗
  const [visible, setVisible] = useState(false);
  //表单验证
  const [form] = Form.useForm();

  //菜品数据总条数
  const [orderTotal, setOrderTotal] = useState(1);
  //页数
  const [orderIndex, setOrderIndex] = useState(1);
  //每页多少条数据
  const [orderSize, setOrderSize] = useState(10);

  //门店分页，当前页数，每页条数
  const orderTabel = (current, pageSize) => {
    setOrderIndex(current);
    setOrderSize(pageSize);
  };
  const onReset=()=>{
    queryFoods()
  }

  //修改门店页码
  const EditOrderSize = e => {
    setOrderSize(Number(e.target.value));
  };

  useEffect(() => {
    queryFoods();
  }, [orderIndex, orderSize]);

  function queryFoods(condition) {
    axios
      .post(
        'http://localhost:9101/product/search',
        {
          condition,
          pageIndex: orderIndex,
          pageSize: orderSize,
          sortFields: [
            {
              asc: false,
              field: 'enabled',
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
        setOrderTotal(res.data.totalCount);
      });
  }

  const onFinish = async values => {
    const { enabled, unitPriceFrom, unitPriceTo, unitOfMeasure, name } = values;
    const conditions = {};

    if (enabled) {
      conditions.enabled = enabled;
    }

    if (unitPriceFrom !== '' && unitPriceTo !== '') {
      conditions.unitPrice = { from: unitPriceFrom * 1, to: unitPriceTo * 1 };
    }

    if (unitOfMeasure) {
      conditions.unitOfMeasure = unitOfMeasure;
    }
    if (name) {
      conditions.name = name;
    }
    await queryFoods(conditions);
  };

  //上下架状态

  const shelfState = record => {
    setVisible(true);
    setPutaway(record);
  };

  const onOkButton = () => {
    console.log(putaway.version);
    if (putaway.enabled) {
      axios
        .post(
          `http://localhost:9101/product/${putaway.id}/disable`,
          {
            version: putaway.version,
          },
          {
            headers: {
              tenantId: 500,
              userId: 11000,
            },
          }
        )
        .then(() => {
          message.success(
            `${putaway.enabled}` === true ? '上架成功' : '下架成功'
          );
        })
        .catch(() => {
          message.error('修改失败');
        });

      setUp(!up);
      setVisible(false);
    } else {
      axios
        .post(
          `http://localhost:9101/product/${putaway.id}/enable`,

          {
            version: putaway.version,
          },
          {
            headers: {
              tenantId: 500,
              userId: 11000,
            },
          }
        )
        .then(() => {
          message.success(
            `${!putaway.enabled}` === true ? '下架成功' : '上架成功'
          );
        })
        .catch(() => {
          message.error('修改失败');
        });

      setUp(!up);
      setVisible(false);
    }
  };

  const hideModal = () => {
    setVisible(false);
  };

  const getFields = () => {
    return (
      <React.Fragment>
        <Col span={24}>
          <PageHeader
            className="site-page-header"
            ghost={false}
            onBack={() => navigate('/food-manage/list')}
            title="菜品管理"
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
                <Link to="/food-manage/create">创建新菜品</Link>
              </Button>,
              <span>{<MenuOutlined />}</span>,
            ]}
          />
        </Col>

        <Col span={8}>
          <Form.Item name={'enabled'} label={'菜品状态'}>
            <Select>
              <Option value="">所有</Option>
              <Option value="true">已上架</Option>
              <Option value="false">已下架</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name={'unitPrice'} label={'菜品单价'}>
            <Input.Group compact>
              <Col span={10}>
                <Form.Item name={'unitPriceFrom'}>
                  <Input className="site-input-left" placeholder="0" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Input className="site-input-split" placeholder="~" />
              </Col>
              <Col span={10}>
                <Form.Item name={'unitPriceTo'}>
                  <Input className="site-input-right" placeholder="9999元" />
                </Form.Item>
              </Col>
            </Input.Group>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name={'unitOfMeasure'} label={'计量单位'}>
            <Input />
          </Form.Item>
        </Col>
      </React.Fragment>
    );
  };

  const columns = [
  
    {
      title: '菜品状态',
      align: 'center',
      dataIndex: 'enabled',
      render: text =>
        text ? (
          <Tag color="yellow">已上架</Tag>
        ) : (
          <Tag color="yellow">已下架</Tag>
        ),
    },
    {
      title: '菜品名',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '菜品单价（元）',
      align: 'center',
      dataIndex: 'unitPrice',
    },
    {
      title: '计量单位',
      align: 'center',
      dataIndex: 'unitOfMeasure',
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
              navigate('/food-manage/edit', {
                state: { datas: record },
                replace: true,
              });
            }}
          >
            编辑
          </span>
          <span className="btn-primary-a"> | </span>
          <span className="btn-primary-a" onClick={() => shelfState(record)}>
            {record.enabled ? '下架' : '上架'}
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <Row gutter={24}>{getFields()}</Row>
        <Row>
          <Col span={16}>
            <Form.Item name={'name'} label={'菜品名'}>
              <Input placeholder="请输入菜品名称" />
            </Form.Item>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button htmlType="submit">查询</Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
                onReset() 
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
          total={orderTotal}
          pageSize={orderSize}
          defaultPageSize={orderSize}
          defaultCurrent={1}
          onChange={current => orderTabel(current, orderSize)}
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
            onChange={EditOrderSize}
          />
          条记录
        </span>
        </Col>
      </Row>

      <Modal
        title={`${putaway.enabled ? '下架' : '上架'}菜品`}
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
        <p>请确定是否需要{putaway.enabled ? '下架' : '上架'}菜品？</p>
      </Modal>
    </div>
  );
}
