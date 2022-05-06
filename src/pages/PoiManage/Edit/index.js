import React, { useEffect, useState } from 'react';
import {
  Form,
  Col,
  Row,
  Button,
  TimePicker,
  Input,
  Select,
  PageHeader,
  message,
  Modal,
} from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { LeftOutlined, MenuOutlined } from '@ant-design/icons';
//转换日期
import 'moment/locale/zh-cn';
import moment from 'moment';
const { Option } = Select;

export default function PoiManageEdit() {
  //取消弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  //表单数据
  const [data, setData] = useState([]);
  //路由跳转
  let navigate = useNavigate();
  let location = useLocation();
  //传过来的值
  const { datas } = location.state;
  //表单验证
  const [form] = Form.useForm();

  useEffect(() => {
    queryBybusinessNo();
  }, []);

  async function queryBybusinessNo() {
    const { data } = await axios.get(
      `http://localhost:9102/shop/${datas.businessNo}`,
      {
        headers: {
          tenantId: 500,
          userId: 11000,
        },
      }
    );
    await setData(data);
    console.log(data);
    form.setFieldsValue({
      name: data.name,
      businessType: data.businessType,
      managementType: data.managementType,
      contactTelephone: data.contact.telephone,
      contactCellphone: data.contact.cellphone,
      contactName: data.contact.name,
      contactAddress: data.contact.address,
      businessArea: data.businessArea,
      comment: data.comment,
      openingHoursOpenTime: moment(data.openingHours.openTime, 'HH:mm'),
      openingHoursCloseTime: moment(data.openingHours.closeTime, 'HH:mm'),
    });
  }

  //保存更新
  function SaveUpdataShops(values) {
    const version = datas.version;
    values.openingHoursOpenTime = moment(values.openingHoursOpenTime).format(
      'HH:mm'
    );
    values.openingHoursCloseTime = moment(values.openingHoursCloseTime).format(
      'HH:mm'
    );
    axios
      .put(
        `http://localhost:9102/shop/${datas.businessNo}`,
        {
          businessArea: values.businessArea,
          businessType: values.businessType,
          comment: values.comment,
          contact: {
            address: values.contactAddress,
            cellphone: values.contactTelephone,
            name: values.contactName,
            telephone: values.contactCellphone,
          },
          managementType: values.managementType,
          name: values.name,
          openingHours: {
            closeTime: values.openingHoursOpenTime,
            openTime: values.openingHoursCloseTime,
          },
          version: version,
        },
        {
          headers: {
            tenantId: 500,
            userId: 11000,
          },
        }
      )

      //   console.log(  { businessArea: values.businessArea,
      //     businessType: values.businessType,
      //     comment: values.comment,
      //     contact: {
      //         address: values.contactAddress,
      //         cellphone: values.contactTelephone,
      //         name: values.contactName,
      //         telephone: values.contactCellphone
      //     },
      //     managementType: values.managementType,
      //     name:values.name,
      //     openingHours: {
      //         closeTime: values.openingHoursOpenTime,
      //         openTime: values.openingHoursCloseTime
      //    } ,version:version}
      //   )
      .then(res => {
        message.success('保存成功');
      })
      .catch(() => {
        message.error('保存失败');
      });
  }

  const onFinish = values => {
    SaveUpdataShops(values);
  };

  //保存并返回
  const SaveBackShops = values => {
    form.validateFields().then(values => {
      const version = datas.version;
      values.openingHoursOpenTime = moment(values.openingHoursOpenTime).format(
        'HH:mm'
      );
      values.openingHoursCloseTime = moment(
        values.openingHoursCloseTime
      ).format('HH:mm');
      axios
        .put(
          `http://localhost:9102/shop/${datas.businessNo}`,
          {
            businessArea: values.businessArea,
            businessType: values.businessType,
            comment: values.comment,
            contact: {
              address: values.contactAddress,
              cellphone: values.contactTelephone,
              name: values.contactName,
              telephone: values.contactCellphone,
            },
            managementType: values.managementType,
            name: values.name,
            openingHours: {
              closeTime: values.openingHoursOpenTime,
              openTime: values.openingHoursCloseTime,
            },
            version: version,
          },
          {
            headers: {
              tenantId: 500,
              userId: 11000,
            },
          }
        )
        .then(res => {
          message.success('编辑成功，返回！');
        })
        .catch(() => {
          message.error('更新失败');
        });
    });
    navigate('/poi-manage/list');
  };

  //对话框打开与关闭
  const showModal = () => {
    setIsModalVisible(true);
  };
  //确定返回主页面
  const handleOk = () => {
    navigate('/poi-manage/list');
  };
  //取消返回当前页面
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getFields = () => {
    return (
      <React.Fragment>
        <Col span={24}>
          <PageHeader
            className="site-page-header"
            ghost={false}
            onBack={() => navigate('/poi-manage/list')}
            title="编辑-门店"
            backIcon={<LeftOutlined />}
            extra={[<span>{<MenuOutlined />}</span>]}
          />
        </Col>

        <Col className="site-page-mark" span={24}>
          通用信息
        </Col>

        <Col span={24}>
          <Form.Item name={'name'} label={'门店名称'}>
            <Input
              rules={[
                { required: true, message: '门店名不能为空' },
                { max: 20, message: '最大长度为20位字符' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={'businessType'} label={'主营业态'}>
            <Select>
              <Option value="DINNER">正餐</Option>
              <Option value="FAST_FOOD">快餐</Option>
              <Option value="HOT_POT">火锅</Option>
              <Option value="BARBECUE">烧烤</Option>
              <Option value="WESTERN_FOOD">西餐</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={'managementType'} label={'管理类型'}>
            <Select>
              <Option value="DIRECT_SALES">直营</Option>
              <Option value="ALLIANCE">加盟</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col className="site-page-mark" span={24}>
          联系方式
        </Col>

        <Col span={8}>
          <Form.Item name={'contactTelephone'} label={'座机号'}>
            <Input
              rules={[
                { max: 15, message: '最大长度15位' },
                { min: 7, message: '至少7位' },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name={'contactCellphone'} label={'手机号'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name={'contactName'} label={'联系人'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={'contactAddress'} label={'地址'}>
            <Input />
          </Form.Item>
        </Col>

        <Col className="site-page-mark" span={24}>
          经营信息
        </Col>
        <Col span={16}>
          <Row>
            <Col span={13}>
              <Form.Item name="openingHoursOpenTime" label={'营业时间'}>
                <TimePicker className="time-picker-m" format={'HH:mm'} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name={'openingHoursCloseTime'}>
                <TimePicker format={'HH:mm'} />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col span={8}>
          <Form.Item name={'businessArea'} label={'门店面积'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={'comment'} label={'门店介绍'}>
            <Input />
          </Form.Item>
        </Col>

        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            textAlign: 'right',
          }}
        >
          <Button onClick={SaveBackShops}>保存并返回</Button>
          <Button htmlType="submit">保存</Button>
          <Button onClick={showModal}>取消</Button>
          <Modal
            title="确认丢失修改的内容"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ textAlign: 'center' }}
            footer={
              <React.Fragment>
                <Button
                  style={{
                    backgroundColor: '#FFC300',
                    border: '0',
                    width: '120px',
                    marginRight: '80px',
                  }}
                  onClick={handleCancel}
                >
                  回到当前页面
                </Button>
                <Button
                  style={{
                    margin: '0 8px',
                    width: '100px',
                    marginRight: '90px',
                  }}
                  onClick={() => {
                    navigate('/poi-manage/list');
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
