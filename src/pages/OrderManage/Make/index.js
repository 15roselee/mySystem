import React, { useEffect, useState } from 'react';
import {
  Form,
  Tag,
  Col,
  Row,
  Button,
  Input,
  Select,
  PageHeader,
  Modal,
  Table,
  message,
} from 'antd';
import axios from 'axios';
import './index.css';
import {
  LeftOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import 'moment/locale/zh-cn';
const { Option } = Select;

export default function OrderManageMake() {
  //路由跳转
  let navigate = useNavigate();
  //可返回
  let location = useLocation();
  //接收传过来的数据
  const { datas } = location.state;
  //订单数据
  const [orderData, setOrderData] = useState([]);
  //制作数据
  const [makeData, setMakeData] =useState([]);



  
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
    queryOrderMakeing(datas.id);
  }, []);

  const queryOrderMakeing = id => {
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

    });
  };

  //把需要制作的菜品存起来
  const makeFoods=(record) => {
    setMakeData([...makeData, record]);
    const makeFood= orderData.map(item => {
      if(item.id === record.id){
        item.status='PREPARING';
      }
      return item;
    });
    setOrderData(makeFood);
  }



  //全部制作
  const makeAlls= () => {
    setMakeData([...orderData]);
    const makeAll= orderData.map(item => {
      item.status ='PREPARING';
      return item;
    })
    setOrderData(makeAll)
  }


  const onFinish=() =>{
    queryOrderMake();
  }

  //修改制作状态
  function queryOrderMake() {
    if (makeData.length === 0 ) {
      message.warn('请选择菜品进行制作');
      return false;
    }
    const items = makeData.map(item => {
      return {
        seqNo: item.seqNo,
        version: item.version,
      };
    });
    axios
      .post(
        `http://localhost:9103/order/catering/${datas.id}/prepare`,
        {
          items: items,
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
        message.success('转为制作中');
        navigate('/order-manage/list');
      })
      .catch(() => {
        message.error('制作失败');
      });
  }

  //下单表格列
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
      title: '计量单位',
      dataIndex: ['productSnapshotOnPlace', 'unitOfMeasure'],
    },
    {
      title: '操作',
      dataIndex: 'status',
      render: (text, record) => {
        if (text === 'PLACED') {
          return <Button onClick={()=>{makeFoods(record)}}>制作</Button>;
        } else {
          return <span>制作中</span>;
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
            title={`制作：${datas.id}`}
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
          <Button className="btn-primary" onClick={makeAlls}>全部制作</Button>
        </Col>

        <Col span={24}>
          <Table columns={columns} dataSource={orderData}   />
        </Col>

        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            textAlign: 'right',
          }}
        >
          <Button htmlType="submit" >确认</Button>

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
