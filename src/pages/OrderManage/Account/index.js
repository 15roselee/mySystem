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
import 'moment/locale/zh-cn';
import "./index.css";
import "../image/wechat.png"
import moment from 'moment';
const { Option } = Select;

export default function OrderManageAccount() {
  //路由跳转
  let navigate = useNavigate();
  //可返回
  let location = useLocation();
  //接收传过来的数据
  const { datas } = location.state;
  //订单数据
  const [orderData, setOrderData] = useState([]);



  //优惠金额
  const [coupon, setCoupon]= useState(0)
  //付款弹窗
  const [payVisible, setPayVisible] = useState(false);
  //付款对话框打开与关闭
  const showPayModal = () => {
    setPayVisible(true);
  };
  //付款弹窗的取消
  const handleCancel = () => {
    setPayVisible(false);
  };

  //获取订单信息
  useEffect(() => {
    queryOrderEdit(datas.id);
  }, []);

  const queryOrderEdit = id => {
    axios
      .get(`http://localhost:9103/order/catering/${id}`, {
        headers: {
          tenantId: 500,
          userId: 11000,
        },
      })
      .then(res => {
        setOrderData(res.data.items);
      });

    form.setFieldsValue({
      name: datas.shopSnapshotOnPlace.name,
      tableNo: datas.tableNo,
      customerCount: datas.customerCount,
      comment: datas.comment,
      coupon:0
    });
  };


  // const onFinish = values => {
  //   console.log(values)
  //   setCoupon(values.coupon);
  // };

  const changeCoupon=(value)=>{
    setCoupon(value);
  }

  //支付
  function queryOrderPay(type) {
    console.log(coupon)
    axios
    .post(
      `http://localhost:9103/order/catering/${datas.id}/bill`,
      {
        paid: datas.totalPrice,
        paymentChannel: type,
        promotion: coupon,
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
      message.success('支付成功');
    })
    .catch(() => {
      message.error('支付失败');
    });
  navigate('/order-manage/list');
  }




  const columns = [
    {
      title: '序号',
      dataIndex: 'seqNo',
      render: (_1, _2, seqNo) => <Tag color="yellow">{seqNo + 1}</Tag>,
    },
    {
      title: '菜品名',
      dataIndex: ['productSnapshotOnPlace', 'name'],
    },
    {
      title: '下单数量',
      dataIndex: ['quantity', 'onPlace'],
    },
    {
      title: '结账数量',
      dataIndex: ['quantity', 'latest'],
    },
    {
      title: '单价',
      dataIndex: ['productSnapshotOnPlace', 'unitPrice'],
    },
    {
      title: '计量单位',
      dataIndex: ['productSnapshotOnPlace', 'unitOfMeasure'],
    },
    {
      title: '总价',
      render:(_, record)=>
       (record.productSnapshotOnPlace.unitPrice * record.quantity.latest).toFixed(2)
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
            title={`结账:${datas.id}`}
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
        <Row >

          <span>
          菜品信息    
          </span>
        

          <span className="site-page-markpri">
          订单总价：{datas.totalPrice} 元
          </span>
        
    
          <span className="site-page-markmo">
          优惠金额：
          </span>
          <Form.Item name={'coupon'} >
          <InputNumber defaultValue={0} onChange={changeCoupon} className="site-page-money"/>元
          </Form.Item>

       </Row>
          
        </Col>

        <Col span={24}>
          <Table columns={columns} dataSource={orderData}   pagination={false}/> 
          <Button className="btn-primary-load"  htmlType="submit"  onClick={showPayModal} >结账</Button>
        </Col>
        <Modal
        title={'请选择支付方式'}
        visible={payVisible}
        width={400}
        onCancel={handleCancel}
        bodyStyle={{ height: 10, lineHeight: 0 }}
        style={{ textAlign: 'center' }}
        footer={
          <React.Fragment>
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                <span
                  onClick={() => {
                    queryOrderPay('WECHAT');
                  }}
                >
                <div className="wechat"></div>
                </span>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <span onClick={() => queryOrderPay('ALIPAY')}>
                <div className="alipay"></div>
               </span>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Button block onClick={handleCancel}>
                取消
              </Button>
            </Row>
          </React.Fragment>
        }
      >
        <p style={{ fontWeight: 700, fontSize: 16 }}>
          待支付金额：{datas.totalPrice - coupon}
        </p>
      </Modal>
      </React.Fragment>
    );
  };

  return (
    <div>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
      >
        <Row gutter={24}>{getFields()}</Row>
      </Form>
    </div>
  );
}
