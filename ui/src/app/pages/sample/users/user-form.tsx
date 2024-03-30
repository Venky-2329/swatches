import { Button, Card, Col, Form, Input, Row, Select, notification } from 'antd';
import { DepartmentService, EmployeeService, createSeason, createUser } from 'libs/shared-services';
import { useNavigate } from 'react-router-dom';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { useEffect, useState } from 'react';
import { RoleEnum } from 'libs/shared-models';

export default function UserForm() {
  const { Option } = Select
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const users: any = JSON.parse(localStorage.getItem('auth'))
  const createdUser = users.userName
  const employeeService = new EmployeeService()
  const [ employeeData, setEmployeeData ] = useState<any[]>([])
  const departmentService = new DepartmentService()
  const [ departData, setDepartData ] = useState<any[]>([])

  console.log(users,',,,,,,,,,,,,,,,,')

  function goToGrid() {
    navigate('/user-grid');
  }

  function onFinish(values) {
    createUser(values).then((res)=>{
        if(res.status){
          onReset()
           notification.success({message:res.internalMessage,placement:'top',duration:1})
           navigate('/user-grid');
        }else{
          notification.error({message:res.internalMessage,placement:'top',duration:1})
        }
    })
  }

  useEffect(()=>{
    getEmployees()
    getDepartments()
  },[])

  const getEmployees =()=>{
    employeeService.getAllEmployees().then((res)=>{
      setEmployeeData(res.data)
    })
  }

  const getDepartments =()=>{
    departmentService.getAllDepartments().then((res)=>{
      setDepartData(res.data)
    })
  }

  const onEmployee = (value,option)=>{
    form.setFieldsValue({email:option?.name})
    form.setFieldsValue({departmentId: option?.department})
  }

  function onReset() {
    form.resetFields();
  }

  return (
    <>
      <Card
        title="User Creation"
        extra={
          <span>
            <Button onClick={goToGrid}>
              View
            </Button>
          </span>
        }
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="User Name" name={'userName'} rules={[{ required: true }]}>
                  <Input placeholder='Enter Username'/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Password" name={'password'} rules={[{ required: true }]}>
                  <Input placeholder='Enter Password' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Employee" name={'employeeId'} rules={[{ required: true }]}>
                  <Select placeholder='Select Employee' onChange={onEmployee}>
                    {employeeData?.map((item) => (
                      <Option key={item.employeeId} value={item.employeeId} name={item.emailId} department={item.department}>
                        {item.employeeName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name={'email'} rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}>
                  <Input placeholder='Enter Email' disabled style={{fontWeight:'bold'}}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Department" name={'departmentId'} rules={[{ required: true }]}>
                  <Select placeholder='Select Department' disabled>
                    {departData?.map((item) => (
                      <Option key={item.id} value={item.id}>
                        <b>{item.departmentName}</b>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Role" name={'role'} rules={[{ required: true }]}>
                  <Select placeholder='Select Role'>
                    {Object.values(RoleEnum).map((i)=>{
                      return(
                        <Option key={i} value={i}>{i}</Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item hidden name={'createdUser'} initialValue={createdUser}>
                  <Input defaultValue={createdUser}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
                  Submit
                </Button>
                <Button onClick={onReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>

      </Card>
    </>
  );
}
