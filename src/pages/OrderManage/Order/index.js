import React, { useEffect, useState } from 'react';
import {
  Form,
  Tag,
  Col,
  Row,
  Button,
  Pagination,
  Input,
  Select,
  PageHeader,
  Modal,
  Space,
  Table,
  message,
  InputNumber,
} from 'antd';
import axios from 'axios';
import {
  LeftOutlined,
  MenuOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import 'moment/locale/zh-cn';
import moment from 'moment';
const { Option } = Select;

export default function OrderManageOrder() {
  //路由跳转
  let navigate = useNavigate();
  //可返回
  let location = useLocation();

  //取消弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  //取消对话框打开与关闭
  const showModal = () => {
    setIsModalVisible(true);
  };
  //取消弹窗的确定
  const handleOk = () => {
    navigate('/order-manage/list');
  };
  //取消弹窗的取消,选择菜品弹窗的取消
  const handleCancel = () => {
    setIsModalVisible(false);
    setFoodList(false);
  };


  //选择门店弹窗
  const [shopList, setShopList] = useState(false);
  //获取展示门店数据
  const [shopData, setShopData] = useState([]);
  //获取下单时的门店id
  const [shopId, setShopId] = useState('')
  //门店数据总条数
  const [total, setTotal] = useState(1);
  //页数
  const [shopIndex, setShopIndex] = useState(1);
  //每页多少条数据
  const [shopSize, setShopSize] = useState(3);



  //选择菜品弹窗
  const [foodList, setFoodList] = useState(false);
  //获取展示菜品的总数据
  const [foodData, setFoodData] = useState([]);
  //下单菜品的数据
  const [orderFood, setOrderFood] = useState([]);

  //菜品数据总条数
  const [foodTotal, setFoodTotal] = useState(1);
  //页数
  const [foodIndex, setFoodIndex] = useState(1);
  //每页多少条数据
  const [foodSize, setFoodSize] = useState(3);

  //获取门店数据
  useEffect(() => {
    queryShops();
  }, [shopIndex, shopSize]);

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
        setShopData(res.data.records);
        setTotal(res.data.totalCount);
      });
  }

  //门店分页，当前页数，每页条数
  const shopTabel = (current, pageSize) => {
    setShopIndex(current);
    setShopSize(pageSize);
  };

  //修改门店页码
  const EditpageSize = e => {
    setShopSize(Number(e.target.value));
  };

  //选择门店回显门店名称到输入框
  const showShopName = record => {
    form.setFieldsValue({
      shopName: record.name,
    });
    setShopId(record.businessNo);
    setShopList(false);
  };

  //选择门店弹窗的打开与关闭
  const SelectModal = () => {
    setShopList(true);
  };

  //选择门店表格列
  const shopColumns = [
    {
      title: '门店名',
      dataIndex: 'name',
    },
    {
      title: '主营业态',
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
      dataIndex: 'managementType',
      render: text => (text === 'ALLIANCE' ? '加盟' : '直营'),
    },
    {
      title: '营业时间',
      dataIndex: 'openingHours',
      render: text => (
        <Space>
          {text.openTime}~{text.closeTime}
        </Space>
      ),
    },
    {
      title: '营业面积',
      dataIndex: 'businessArea',
    },
  ];

  //获取菜品数据
  useEffect(() => {
    queryFoods();
  }, [foodIndex, foodSize]);

  function queryFoods(condition) {
    axios
      .post(
        'http://localhost:9101/product/search',
        {
          condition,
          pageIndex: foodIndex,
          pageSize: foodSize,
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
        setFoodData(res.data.records);
        setFoodTotal(res.data.totalCount);
      });
  }

  const onFinish = value => {
   // 是否选菜
    if (orderFood.length === 0) {
      message.error('您还未选择菜品，请选择菜品后再下单');
      return false;
    }
    //获取总价
    let totalPrice = 0;
    orderFood.forEach(i => {
      totalPrice += i.quantity * i.unitPrice;
    });
    
    const items = orderFood.map(i => {
      return {
        productId: i.id,
        quantity: i.quantity,
        seqNo: i.key,
      };
    });

    axios.post(
      `http://localhost:9103/order/catering`,

      {
        comment: value.comment,
        customerCount: value.customerCount,
        items:items,
        shopBusinessNo:shopId,
        tableNo: value.tableNo,
        totalPrice:totalPrice,
      },
      {
        headers: {
          tenantId: 500,
          userId: 11000,
        },
      }
    )
    .then(() => {
      message.success('下单成功');
      navigate('/order-manage/list');
    })
    .catch(() => {
      message.error('下单失败');
    });
    
  };

  //菜品分页，当前页数，每页条数
  const foodTabel = (current, pageSize) => {
    setFoodIndex(current);
    setFoodSize(pageSize);
  };

  //修改菜品页码
  const EditfoodSize = e => {
    setFoodSize(Number(e.target.value));
  };

  //点击添加一行，将数据展示在table
  const addFood = record => {
    for (let i = 0; i < orderFood.length; i++) {
      if (orderFood[i].id === record.id) {
        message.error('该菜品已经被选择');
        setFoodList(false);
        return false;
      }
    }
    const key = orderFood.length;
    const newData = { key: key + 1, quantity: 1, ...record };
    setOrderFood([...orderFood, newData]);
    setFoodList(false);
  };

  //删除对应行
  const deleteRecord = key => {
    console.log('123');
    const newData = orderFood.filter(item => {
      return item.key !== key;
    });
    const data = newData.map((item, index) => {
      item.key = index + 1;
      return item;
    });
    setOrderFood(data);
  };

  //选择菜品弹窗的打开与关闭
  const SelectFoodModal = () => {
    setFoodList(true);
  };

  //改变数量
  const changeQuantity = (value, record) => {
    const newData = orderFood.map(item => {
      if (item.key === record.key) {
        item.quantity = value;
        console.log(value);
      }
      return item;
    });

    setOrderFood(newData);
  };

  //选择菜品表格
  const foodColumns = [
    {
      title: '菜品名',
      dataIndex: 'name',
    },
    {
      title: '菜品单价（元）',
      dataIndex: 'unitPrice',
    },
    {
      title: '计量单位',
      dataIndex: 'unitOfMeasure',
    },
  ];

  //下单表格
  const columns = [
    {
      title: '序号',
      dataIndex: 'seqNo',
      render: (_, record) => <Tag color="yellow">{record.key}</Tag>,
    },
    {
      title: '菜品名',
      dataIndex: 'name',
      render: (_, record) => {
        return (
          <Row>
            <Input.Group compact className="form-control-group">
              <Col span={16}>
                <Form.Item label={'菜品名'}>
                  <Input
                    className="shopinput"
                    value={record.name}
                    readOnly={true}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button className="shopselect" onClick={SelectFoodModal}>
                  选择
                </Button>
              </Col>
            </Input.Group>
          </Row>
        );
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      render: (_, record) => {
        return (
          <Form.Item className="form-control-input">
            <InputNumber
              className="form-control-quantity"
              min={1}
              type={'number'}
              defaultValue={record.quantity}
              onChange={value => changeQuantity(value, record)}
            />
          </Form.Item>
        );
      },
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
    },
    {
      title: '计量单位',
      dataIndex: 'unitOfMeasure',
    },
    {
      title: '总价',
      dataIndex: 'totalPrice',
      render: (_, record) => (record.unitPrice * record.quantity).toFixed(2),
    },
    {
      render: (_, record) => {
        return (
          <MinusCircleOutlined
            style={{ fontSize: 25, marginLeft: 30 }}
            onClick={() => {
              deleteRecord(record.key);
            }}
          />
        );
      },
    },
  ];

  //表单验证
  const [form] = Form.useForm();
  const getFields = () => {
    return (
      <React.Fragment>
        <Col span={24}>
          <PageHeader
            className="site-page-header"
            ghost={false}
            onBack={() => navigate('/order-manage/list')}
            title="下单"
            backIcon={<LeftOutlined />}
            extra={[<span>{<MenuOutlined />}</span>]}
          />
        </Col>

        <Col className="site-page-mark" span={24}>
          基本信息
        </Col>

        <Col span={12}>
          <Row>
            <Input.Group compact>
              <Col span={20}>
                <Form.Item name={'shopName'} label={'门店名'}>
                  <Input className="shopinput" disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Button className="shopselect" onClick={SelectModal}>
                  选择
                </Button>
              </Col>
            </Input.Group>
          </Row>
        </Col>

        <Col span={12}>
          <Form.Item name={'tableNo'} label={'座位号'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={'customerCount'} label={'用餐人数'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={'comment'} label={'备注'}>
            <Input />
          </Form.Item>
        </Col>

        <Col className="site-page-mark" span={24}>
          菜品信息
        </Col>

        <Col span={24}>
          <Table columns={columns} dataSource={orderFood} pagination={false} />
          <Button className="btn-primary-load" onClick={SelectFoodModal}>
            添加新菜品
          </Button>
        </Col>

        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            textAlign: 'right',
          }}
        >
          <Button htmlType="submit">确认</Button>

          <Button onClick={showModal}>取消</Button>

          <Modal
            title="选择门店"
            visible={shopList}
            style={{ textAlign: 'center' }}
            footer={
              <Row>
                <Col span={14}>
                  <Pagination
                    size="small"
                    total={total}
                    pageSize={shopSize}
                    defaultPageSize={shopSize}
                    defaultCurrent={1}
                    onChange={current => shopTabel(current, shopSize)}
                  />
                </Col>
                <Col span={6}>
                  <span>
                    每页{' '}
                    <Input
                      className="form-control-yema"
                      defaultValue={3}
                      onChange={EditpageSize}
                    />
                    条记录
                  </span>
                </Col>
              </Row>
            }
          >
            <Table
              dataSource={shopData}
              columns={shopColumns}
              onRow={record => {
                return {
                  onClick: () => {
                    showShopName(record);
                  },
                };
              }}
              pagination={false}
            ></Table>
          </Modal>

          <Modal
            title="选择菜品"
            visible={foodList}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ textAlign: 'center' }}
            footer={
              <Row>
                <Col span={14}>
                  <Pagination
                    size="small"
                    total={foodTotal}
                    pageSize={shopSize}
                    defaultPageSize={shopSize}
                    defaultCurrent={1}
                    onChange={current => foodTabel(current, shopSize)}
                  />
                </Col>
                <Col span={8}>
                  <span>
                    每页 <Input className="form-control-yema" defaultValue={3} onChange={EditfoodSize} />
                    条记录
                  </span>
                </Col>

              </Row>
            }
          >
            <Table
              dataSource={foodData}
              columns={foodColumns}
              onRow={record => {
                return {
                  onClick: () => {
                    addFood(record);
                  },
                };
              }}
              pagination={false}
            ></Table>
          </Modal>

          <Modal
            title="确认丢失修改的内容"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ textAlign: 'center' }}
            footer={
              <React.Fragment>
                <Button onClick={handleCancel}>回到当前页面</Button>
                <Button
                  onClick={() => {
                    navigate('/order-manage/list');
                  }}
                >
                  返回主界面
                </Button>
              </React.Fragment>
            }
          >
            <p>所有修改均会丢失，请确认？</p>
          </Modal>
        </Col>
      </React.Fragment>
    );
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        name="advanced_search"
        className="ant-advanced-search-form"
      >
        <Row gutter={24}>{getFields()}</Row>
      </Form>
    </div>
  );
}
