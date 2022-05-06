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
import moment from 'moment';
const { Option } = Select;



export default function OrderManageCheck() {
  //路由跳转
  let navigate = useNavigate();
  //可返回
  let location = useLocation();
  //接收传过来的数据
  const { datas } = location.state;
  //订单数据
  const [orderData, setOrderData] = useState([]);
  //应付
  const [paid, setPaid] = useState(0);
  //优惠
  const [promotion, setPromotion] = useState(0);
  //结账方式
  const[payment,setPayment]=useState('');



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
    queryOrderEdit(datas.id);
  }, []);

  const queryOrderEdit = id => {
    axios
      .get(`http://localhost:9103/order/catering/${id}`, {
        headers: {
          tenantId: 500,
          userId: 11000,
        }
      })
      .then(res => {
        setOrderData(res.data.items);
        setPayment(res.data.billing.paymentChannel);
        setPaid(res.data.billing.paid);
        setPromotion(res.data.billing.promotion);

        form.setFieldsValue({
          name: datas.shopSnapshotOnPlace.name,
          tableNo: datas.tableNo,
          customerCount: datas.customerCount,
          comment: datas.comment,
        });
      });
  };
  

  const onFinish = () => {
    queryOrderOut();
  }

  //确认出餐
  function queryOrderOut() {
    axios
      .post(
        `http://localhost:9103/order/catering/${datas.id}/produce`,
        {
          items: [
            {
              accessories: [
                {
                  productAccessoryId: datas.productAccessoryId,
                  quantityOnAdjustment: datas.quantityOnAdjustment,
                  quantityOnProduce: datas.quantityOnProduce,
                  seqNo: datas.seqNo,
                  version: datas.version,
                },
              ],
              productId: datas.productId,
              productMethodId: datas.productMethodId,
              quantity: datas.quantity,
              quantityOnAdjustment: datas.quantityOnAdjustment,
              quantityOnProduce: datas.quantityOnProduce,
              seqNo: datas.seqNo,
              version: datas.version,
            },
          ],
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
      })
      .catch(() => {
        message.error('出餐失败');
      });
  }




  //已完成订单
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
            title={`已完成订单：${datas.id}`}
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
          
          <span className="site-page-markpri">
          订单总价：{datas.totalPrice} 元
          </span>
        
    
          <span className="site-page-markmo">
          优惠金额：{promotion}元
          </span>

        </Col>

        <Col span={24}>
          <Table columns={columns} dataSource={orderData} pagination={false} />
          <span>{`已使用${payment === 'WECHAT' ? '微信' :'支付宝'}支付:${paid-promotion}元`}</span>
        </Col>

        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            textAlign: 'right',
          }}
        >

          <Button onClick={showModal}>返回</Button>

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
