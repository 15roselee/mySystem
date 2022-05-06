import React, { useState } from 'react';
import {
  Form,
  Col,
  Row,
  Button,
  message,
  Input,
  Select,
  PageHeader,
  Modal,
  Space,
} from 'antd';
import axios from 'axios';
import './index.css';
import { useNavigate } from 'react-router-dom';
import {
  LeftOutlined,
  MenuOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;
export default function FoodManageCreate() {
  //取消弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  let navigate = useNavigate();
  const [form] = Form.useForm();

  //对话框打开与关闭
  const showModal = () => {
    setIsModalVisible(true);
  };
  //确定
  const handleOk = () => {
    navigate('/food-manage/list');
  };
  //取消
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = values => {
    const condition = {
      name: values.name,
      unitPrice: values.unitPrice,
      minSalesQuantity: values.minSalesQuantity,
      increaseSalesQuantity: values.increaseSalesQuantity,
      unitOfMeasure: values.unitOfMeasure,
      description: values.description,
      accessoryGroups:
        values.accessoryGroups === undefined
          ? []
          : [
              {
                name: '配菜',
                options: [...values['accessoryGroups']],
              },
            ],
      methodGroups:
        values.methodGroups === undefined ? [] : [...values['methodGroups']],
    };
    axios
      .post('http://localhost:9101/product', condition, {
        headers: {
          tenantId: 500,
          userId: 11000,
        },
      })
      .then(() => {
        message.success('保存成功');
      })
      .catch(() => {
        message.error('保存失败');
      });
  };

  function saveBackFood() {
    form.validateFields().then(values => {
      const condition = {
        name: values.name,
        unitPrice: values.unitPrice,
        minSalesQuantity: values.minSalesQuantity,
        increaseSalesQuantity: values.increaseSalesQuantity,
        unitOfMeasure: values.unitOfMeasure,
        description: values.description,
        accessoryGroups:
          values.accessoryGroups === undefined
            ? []
            : [
                {
                  name: '配菜',
                  options: [...values['accessoryGroups']],
                },
              ],
        methodGroups:
          values.methodGroups === undefined ? [] : [...values['methodGroups']],
      };
      axios
        .post(
          `http://localhost:9101/product`,
          condition,

          {
            headers: {
              tenantId: 500,
              userId: 11000,
            },
          }
        )
        .then(() => {
          message.success('创建新菜品成功');
        })
        .catch(() => {
          message.error('创建新菜品失败');
        });
    });

    navigate('/food-manage/list');
  }

  const getFields = () => {
    return (
      <React.Fragment>
        <Col span={24}>
          <PageHeader
            className="site-page-header"
            ghost={false}
            onBack={() => navigate('/food-manage/list')}
            title="新菜品"
            backIcon={<LeftOutlined />}
            extra={[<span>{<MenuOutlined />}</span>]}
          />
        </Col>

        <Col className="site-page-mark" span={24}>
          通用信息
        </Col>

        <Col span={24}>
          <Form.Item name={'name'} label={'菜品名'}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={'unitPrice'} label={'菜品单价'} defaultValue={'10'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={'unitOfMeasure'} label={'计量单位'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name={'minSalesQuantity'}
            label={'起售量'}
            defaultValue={'10'}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={'increaseSalesQuantity'} label={'增售量'}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={'description'} label={'描述'}>
            <Input />
          </Form.Item>
        </Col>

        <Form.List name="methodGroups">
          {(fields, { add, remove }) => (
            <>
              <Col className="site-page-mark" span={24}>
                做法
                <Button className="btn-primary" onClick={() => add()}>
                  添加做法组
                </Button>
              </Col>

              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Col
                  key={key}
                  style={{ marginBottom: 8 }}
                  align="baseline"
                  span={24}
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        className="form-groupmethod"
                        label={'做法组名'}
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[
                          { required: true, message: '做法组名不能为空' },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <MinusCircleOutlined
                        className="Icom-reduce"
                        onClick={() => remove(name)}
                      />
                    </Col>

                    <Col span={10}>
                      <Form.List name={[name, 'options']}>
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(
                              ({ key, name, fieldKey, ...restField }) => (
                                <Space
                                  key={key}
                                  style={{ display: 'flex', marginBottom: 8 }}
                                  align="baseline"
                                >
                                  <Form.Item
                                    className="site-Input"
                                    {...restField}
                                    name={[name, 'name']}
                                    label={`做法${name + 1}`}
                                    fieldKey={[fieldKey, 'method']}
                                    rules={[
                                      {
                                        required: true,
                                        message: '做法不能为空',
                                      },
                                    ]}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <MinusCircleOutlined
                                    className="Icom-reduce"
                                    onClick={() => remove(name)}
                                  />
                                </Space>
                              )
                            )}
                            <Form.Item>
                              <Button onClick={() => add()}>添加做法</Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Col>
                  </Row>
                </Col>
              ))}
            </>
          )}
        </Form.List>

        <Col className="site-page-mark" span={24}>
          加料
        </Col>
        <Col span={24}>
          <Form.List name="accessoryGroups">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          className="site-page-addname"
                          label={'加料名'}
                          {...restField}
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                          rules={[
                            { required: true, message: '加料名不能为空' },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          className="site-page-addprice"
                          label={'单价'}
                          {...restField}
                          name={[name, 'unitPrice']}
                          fieldKey={[fieldKey, 'unitPrice']}
                          rules={[{ required: true, message: '单价不能为空' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          className="site-page-addunit"
                          label={'计量单位'}
                          {...restField}
                          name={[name, 'unitOfMeasure']}
                          fieldKey={[fieldKey, 'unitOfMeasure']}
                          rules={[
                            { required: true, message: '计量单位不能为空' },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <MinusCircleOutlined
                        className="Icom-reduce"
                        onClick={() => remove(name)}
                      />
                    </Row>
                  </Col>
                ))}
                <Form.Item>
                  <Button className="btn-primary-load" onClick={() => add()}>
                    添加加料
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>

        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            textAlign: 'right',
          }}
        >
          <Button onClick={saveBackFood}>保存并返回</Button>
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
                    width: '120px',
                    marginRight: '70px',
                  }}
                  onClick={() => {
                    navigate('/food-manage/list');
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
        initialValues={{}}
      >
        <Row gutter={24}>{getFields()}</Row>
      </Form>
    </div>
  );
}
