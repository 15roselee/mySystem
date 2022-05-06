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

export default function OrderManageOutFood() {
  //路由跳转
  let navigate = useNavigate();
  //可返回
  let location = useLocation();
  //接收传过来的数据
  const { datas } = location.state;
  //订单数据
  const [orderData, setOrderData] = useState([]);
  //出餐数据
  const [outMealData, setOutMealData] = useState([]);

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

  //获取订单信息
  useEffect(() => {
    queryOrderOutFood(datas.id);
  }, []);

  const queryOrderOutFood = id => {
    axios
      .get(`http://localhost:9103/order/catering/${id}`, {
        headers: {
          tenantId: 500,
          userId: 11000,
        },
      })
      .then(res => {
        setOrderData(res.data.items);

        form.setFieldsValue({
          name: datas.shopSnapshotOnPlace.name,
          tableNo: datas.tableNo,
          customerCount: datas.customerCount,
          comment: datas.comment,
        });

        const data = res.data.items.map(item => {
          return {
            seqNo: item.seqNo,
            version: item.version,
            quantityOnProduce: item.quantity.latest - item.quantity.onProduce,
          };
        });

        setOutMealData(data);
      });
  };

  //改变出餐数量
  const changeQuantity = (e,record) => {
    const changeData = outMealData.map(item => {
      if (item.seqNo === record.seqNo) {
        item.quantityOnProduce = e;
      }
      return item;
    });
   setOutMealData(changeData);
  };

  const onFinish = () => {
    queryOrderOut(outMealData);
  };

  //确认出餐
  function queryOrderOut(outMealData) {
    const paramsData=outMealData.filter(item =>{
     return item.quantityOnProduce!==0
    })

    axios
      .post(
        `http://localhost:9103/order/catering/${datas.id}/produce`,

        {
          items: paramsData,
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
        message.success('出餐成功');
        navigate('/order-manage/list');
      })
      .catch(() => {
        message.error('出餐失败');
      });
  }

  //出餐表格
  const columns = [
    {
      title: '序号',
      dataIndex: 'seqNo',
      render: (text, _) => <Tag color="yellow">{text}</Tag>,
    },
    {
      title: '菜品名',
      dataIndex: ['productSnapshotOnPlace', 'name'],
    },
    {
      title: '下单数量',
      dataIndex: ['quantity', 'latest'],
    },
    {
      title: '计量单位',
      dataIndex: ['productSnapshotOnPlace', 'unitOfMeasure'],
    },
    {
      title: '已出餐',
      dataIndex: ['quantity', 'onProduce'],
    },
    {
      title: '本次出餐',
      render: (_, record) => {
        if(record.quantity.latest-record.quantity.onProduce===0){
          return false
        }else{
          return (
            <Form style={{ height: 30 }}>
              <Form.Item>
                <InputNumber
                  onChange={(e)=>changeQuantity(e,record)}
                  type={'number'}
                  min={0}
                  max={record.quantity.latest - record.quantity.onProduce}
                  defaultValue={
                    record.quantity.latest - record.quantity.onProduce
                  }
                />
              </Form.Item>
            </Form>
          );
        }  
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
            title={`出餐：${datas.id}`}
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
          <Table columns={columns} dataSource={orderData} pagination={false} />
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
