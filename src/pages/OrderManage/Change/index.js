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
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import 'moment/locale/zh-cn';
import moment from 'moment';
const { Option } = Select;

export default function OrderManageChange() {
  //路由跳转
  let navigate = useNavigate();
  //可返回
  let location = useLocation();
  //接收传过来的数据
  const { datas } = location.state;
  //订单总数据
  const [orderDetail, setOrderDetail] = useState([]);

  //菜品总数据
  const [foodData, setFoodData] = useState([]);
  //菜品弹窗
  const [foodVisible, setFoodVisible] = useState(false);
  //选择菜品弹窗的打开与关闭
  const selectFoodModal = () => {
    setFoodVisible(true);
  };
  //菜品数据总条数
  const [foodTotal, setFoodTotal] = useState(1);
  //页数
  const [foodIndex, setFoodIndex] = useState(1);
  //每页多少条数据
  const [foodSize, setFoodSize] = useState(3);
  //菜品分页，当前页数，每页条数
  const foodTabel = (current, pageSize) => {
    setFoodIndex(current);
    setFoodSize(pageSize);
  };

  //修改菜品页码
  const EditfoodSize = e => {
    setFoodSize(Number(e.target.value));
  };

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
  };

  const onFinish = () => {
    let items = orderDetail.map(item => {
      if (item.productSnapshotOnPlace.id) {
        return {
          seqNo: item.seqNo,
          version: item.version,
          quantityOnAdjustment: item.quantityOnAdjustment,
        };
      } else {
        return {
          productId: item.id,
          seqNo: item.seqNo,
          version: item.version,
          quantityOnAdjustment: item.quantityOnAdjustment,
        };
      }
    });

    items = items.filter(i => {
      return i.quantityOnAdjustment !== 0;
    });

    axios
      .post(
        `http://localhost:9103/order/catering/${datas.id}/adjust`,
        {
          items,
          version: datas.version,
        },
        {
          headers: {
            tenantId: 500,
            userId: 11000,
          },
        }
      )
      .then(() => {
        message.success('加退菜成功！');
        navigate('/order-manage/list')
      })
      .catch(() => {
        message.error('加退菜失败');
      });
  };

  //获取加退菜订单信息
  useEffect(() => {
    queryOrderChange(datas.id);
  }, []);

  const queryOrderChange = id => {
    axios
      .get(`http://localhost:9103/order/catering/${id}`, {
        headers: {
          tenantId: 500,
          userId: 11000,
        },
      })
      .then(res => {
        const dataSource = res.data.items.map(item => {
          item.quantityOnAdjustment = 0;
          return item;
        });
        setOrderDetail(dataSource);
        // const data = res.data.items.map(item => {
        //   return {
        //     seqNo: item.seqNo,
        //     version: item.version,
        //     quantityOnProduce: item.quantity.onProduce,
        //     quantityOnAdjustment:item.quantityOnAdjustment,
        //     quantity:item.quantity,
        //   };
        // });
      });

    form.setFieldsValue({
      name: datas.shopSnapshotOnPlace.name,
      tableNo: datas.tableNo,
      customerCount: datas.customerCount,
      comment: datas.comment,
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'seqNo',
      render: (_1, _2, seqNo) => <Tag color="yellow">{seqNo + 1}</Tag>,
    },
    {
      title: '菜品名',
      dataIndex: ['productSnapshotOnPlace', 'name'],

      render: (text, record) => {
        if (record.status) {
          return <span>{text}</span>;
        }
        return (
          <Row>
            <Input.Group compact className="form-control-group">
              <Col span={12}>
                <Form.Item label={'菜品名'}>
                  <Input
                    className="shopinput"
                    value={record.name}
                    readOnly={true}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Button className="shopselect" onClick={selectFoodModal}>
                  选择
                </Button>
              </Col>
            </Input.Group>
          </Row>
        );
      },
    },
    {
      title: '当前数量',
      dataIndex: ['quantity', 'latest'],
    },
    {
      title: '计量单位',
      dataIndex: ['productSnapshotOnPlace', 'unitOfMeasure'],
    },
    {
      title: '已制作数量',
      dataIndex: ['quantity', 'onProduce'],
    },
    {
      title: '调整数量',
      dataIndex: 'quantityOnAdjustment',
      render: (text, record) => {
        return (
          <InputNumber
            onChange={value => changeAdjust(value, record)}
            type={'number'}
            min={record.quantity.onProduce-record.quantity.latest}
            defaultValue={text}
          />
        );
      },
    },
    {
      title: '调整后数量',
      render: (_, record) =>
        record.quantity.latest + record.quantityOnAdjustment,
    },
  ];

  const changeAdjust = (value, record) => {
    const newData = orderDetail.map(item => {
      if (item.seqNo === record.seqNo) {
        item.quantityOnAdjustment = value;
      }
      return item;
    });
    setOrderDetail(newData);
  };

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

  //点击添加一行，将数据展示在table
  const addFood = record => {
    for (let i = 0; i < orderDetail.length; i++) {
      if (orderDetail[i].id === record.id) {
        message.error('该菜品已经被选择');
        setFoodVisible(false);
        return false;
      }
    }
    const key = orderDetail.length;
    const newData = {
      seqNo: key + 1,
      quantity: {
        onPlace: 0,
        onProduce: 0,
        latest:0
      },
      quantityOnAdjustment: 0,
      id: record.id,
      productSnapshotOnPlace: {
        name: record.name,
        unitOfMeasure: record.unitOfMeasure,
      },
      ...record,
    };
    setOrderDetail([...orderDetail, newData]);
    setFoodVisible(false);
  };

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
            title="加退菜"
            backIcon={<LeftOutlined />}
            extra={[<span>{<MenuOutlined />}</span>]}
          />
        </Col>

        <Col className="site-page-mark" span={24}>
          基本信息
        </Col>

        <Col span={12}>
          <Form.Item name={'name'} label={'门店名'}>
            <Input disabled={true} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={'tableNo'} label={'座位号'}>
            <Input disabled={true} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={'customerCount'} label={'用餐人数'}>
            <Input disabled={true} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={'comment'} label={'备注'}>
            <Input disabled={true} />
          </Form.Item>
        </Col>

        <Col className="site-page-mark" span={24}>
          菜品信息
        </Col>

        <Col span={24}>
          <Table
            columns={columns}
            dataSource={orderDetail}
            pagination={false}
          />
          <Button className="btn-primary-load" onClick={selectFoodModal}>
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
            title="选择菜品"
            visible={foodVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ textAlign: 'center' }}
            footer={
              <Row>
                <Col span={14}>
                  <Pagination
                    size="small"
                    total={foodTotal}
                    pageSize={foodSize}
                    defaultPageSize={foodSize}
                    defaultCurrent={1}
                    onChange={current => foodTabel(current, foodSize)}
                  />
                </Col>
                <Col span={8}>
                  <span>
                    每页{' '}
                    <Input
                      className="form-control-yema"
                      defaultValue={3}
                      onChange={EditfoodSize}
                    />
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
