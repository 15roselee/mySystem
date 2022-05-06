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
export default function OrderManageList() {
  //菜品数据
  const [data, setData] = useState([]);

  //菜品数据总条数
  const [orderTotal, setOrderTotal] = useState(1);
  //页数
  const [orderIndex, setOrderIndex] = useState(1);
  //每页多少条数据
  const [orderSize, setOrderSize] = useState(10);
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

  useEffect(() => {
    queryOrders();
  }, [orderIndex, orderSize]);

  //重置
  const  onReset=()=>{
    queryOrders();
  }

  function queryOrders(condition) {
    axios
      .post(
        'http://localhost:9103/order/catering/search',
        {
          condition,
          pageIndex: orderIndex,
          pageSize: orderSize,
          sortFields: [
            {
              asc: true,
              field: 'id',
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
    const { status, totalPriceFrom, totalPriceTo, tableNo, customerCount } =
      values;
    const conditions = {};

    if (status) {
      conditions.status = status;
    }

    if (totalPriceFrom !== '' && totalPriceTo !== '') {
      conditions.totalPrice = {
        from: totalPriceFrom * 1,
        to: totalPriceTo * 1,
      };
    }

    if (tableNo) {
      conditions.tableNo = tableNo;
    }
    if (customerCount) {
      conditions.customerCount = customerCount;
    }
    await queryOrders(conditions);
  };

  //门店分页，当前页数，每页条数
  const orderTabel = (current, pageSize) => {
    setOrderIndex(current);
    setOrderSize(pageSize);
  };

  //修改门店页码
  const EditOrderSize = e => {
    setOrderSize(Number(e.target.value));
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
          message.success('修改成功');
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
          message.success(`${!putaway.enabled}` + '成功');
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
            onBack={() => navigate('/order-manage/list')}
            title="订单管理"
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
                <Link to="/order-manage/order">下单</Link>
              </Button>,
              <span>{<MenuOutlined />}</span>,
            ]}
          />
        </Col>

        <Col span={8}>
          <Form.Item name={'status'} label={'状态'}>
            <Select>
              <Option value="">所有</Option>
              <Option value="PLACED">已下单</Option>
              <Option value="PREPARING">制作中</Option>
              <Option value="PREPARED">已出餐</Option>
              <Option value="BILLED">已完成</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name={'tableNo'} label={'座位号'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name={'customerCount'} label={'就餐人数'}>
            <Input />
          </Form.Item>
        </Col>
      </React.Fragment>
    );
  };

  const columns = [
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: text =>
        text === 'PLACED' ? (
          <Tag color="yellow">已下单</Tag>
        ) : text === 'PREPARING' ? (
          <Tag color="yellow">制作中</Tag>
        ) : text === 'BILLED' ? (
          <Tag color="yellow">已完成</Tag>
        ) : (
          <Tag color="yellow">已出餐</Tag>
        ),
    },
    {
      title: '门店',
      align: 'center',
      dataIndex: ['shopSnapshotOnPlace', 'name'],
    },
    {
      title: '座位号',
      align: 'center',
      dataIndex: 'tableNo',
    },
    {
      title: '就餐人数',
      align: 'center',
      dataIndex: 'customerCount',
    },
    {
      title: '订单总价（元）',
      align: 'center',
      dataIndex: 'totalPrice',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'status',

      render: (text, record) =>
        record.status === 'PLACED' ? (
          <div className="btn-primary-a">
            <span
              className="btn-primary-a"
              onClick={() => {
                navigate('/order-manage/make', {
                  state: { datas: record },
                  replace: true,
                });
              }}
            >
              制作
            </span>
            <span> | </span>
            <span
              className="btn-primary-a"
              onClick={() => {
                navigate('/order-manage/change', {
                  state: { datas: record },
                  replace: true,
                });
              }}
            >
              加退菜
            </span>
          </div>
        ) : record.status === 'PREPARING' ? (
          <div className="btn-primary-a">
            <span
              className="btn-primary-a"
              onClick={() => {
                navigate('/order-manage/make', {
                  state: { datas: record },
                  replace: true,
                });
              }}
            >
              制作
            </span>
            <span> | </span>
            <span
              className="btn-primary-a"
              onClick={() => {
                navigate('/order-manage/outfood', {
                  state: { datas: record },
                  replace: true,
                });
              }}
            >
              出餐
            </span>
            <span> | </span>
            <span
              className="btn-primary-a"
              onClick={() => {
                navigate('/order-manage/change', {
                  state: { datas: record },
                  replace: true,
                });
              }}
            >
              加退菜
            </span>
          </div>
        ) : record.status === 'BILLED' ? (
          <div className="btn-primary-a">
            <span
              onClick={() => {
                navigate('/order-manage/check', {
                  state: { datas: record },
                  replace: true,
                });
              }}
            >
              查看
            </span>
          </div>
        ) : record.status === 'PREPARED' ? (
          <div className="btn-primary-a">
            <span
              className="btn-primary-a"
              onClick={() => {
                navigate('/order-manage/change', {
                  state: { datas: record },
                  replace: true,
                });
              }}
            >
              加退菜
            </span>

            <span> | </span>

            <span
              className="btn-primary-a"
              onClick={() => {
                navigate('/order-manage/account', {
                  state: { datas: record },
                  replace: true,
                });
              }}
            >
              结账
            </span>
          </div>
        ) : (
          record.status === 'CANCELLED'
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
        initialValues={{
          enabled: false,
        }}
      >
        <Row gutter={24}>{getFields()}</Row>
        <Row>
          <Col span={16}>
            <Form.Item label={'菜品总价'}>
              <Input.Group compact>
                <Col span={11}>
                  <Form.Item name={'totalPriceFrom'}>
                    <Input className="site-input-left" placeholder="0" />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Input className="site-input-split" placeholder="~" />
                </Col>
                <Col span={11}>
                  <Form.Item name={'totalPriceTo'}>
                    <Input className="site-input-right" placeholder="9999元" />
                  </Form.Item>
                </Col>
              </Input.Group>
            </Form.Item>
          </Col>

          <Col span={8} style={{ textAlign: 'right' }}>
            <Button htmlType="submit">查询</Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
                onReset() ;
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
