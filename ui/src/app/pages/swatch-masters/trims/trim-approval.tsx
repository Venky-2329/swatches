import React, { useEffect, useRef, useState } from 'react';
import {Alert,Button,Card,Col,DatePicker,Divider,Drawer,Form,Input,Modal,Popconfirm,Row,Segmented,Select,Table,Tabs,Tag,Tooltip,message} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {SearchOutlined,UndoOutlined,FileImageOutlined, BarcodeOutlined, EyeOutlined} from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import Highlighter from 'react-highlight-words';
import { DateReq, StatusEnum, SwatchStatus } from 'libs/shared-models';
import { FabricSwatchService, TrimSwatchService } from 'libs/shared-services';
import TextArea from 'antd/es/input/TextArea';


const TrimSwatchApproval = () => {
  let navigate = useNavigate();
  const { Option } = Select
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [form] = Form.useForm();
  const [tabName, setTabName] = useState<string>('SENT_FOR_APPROVAL');
  const [countData, setCountData] = useState<any[]>([]);
  const searchInput = useRef(null); 
  const [modal, setModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({});
  const [selectedTabKey, setSelectedTabKey] = useState('1');
  const [activeKey, setActiveKey] = useState('SENT_FOR_APPROVAL')
  const service = new TrimSwatchService()
  const [imagePath, setImagePath] = useState('');
  const [action, setAction] = useState(null);
  const location = useLocation();
  const createUser = JSON.parse(localStorage.getItem('auth'));
  const userRole = createUser.role;
  const department = createUser.departmentId



  useEffect(() => {
    setActiveKey(tabName);
  }, [tabName]);

  useEffect(() => {
    getData(tabName);
    getCount();
  }, []);

  // useEffect(() => {
  //   const tabKey = location.state?.tab;
  //   if (tabKey) {
  //     setActiveKey(tabKey);
  //     getData(tabKey);
  //   }
  // }, [location.state]);

  const getData = (value: any) => {
    const req = new DateReq(value, undefined, undefined);
    if (form.getFieldValue('fromDate') !== undefined) {
      req.fromDate = form.getFieldValue('fromDate')[0].format('YYYY-MM-DD');
    }
    if (form.getFieldValue('fromDate') !== undefined) {
      req.toDate = form.getFieldValue('fromDate')[1].format('YYYY-MM-DD');
    }
    service.getAllTrimSwatchData(req).then((res) => {
      if (res.status) {
        setData(res.data);
        message.success(res.internalMessage, 2);
      } else {
        setData([]);
        message.error(res.internalMessage, 2);
      }
    });
  };

  const getCount = () => {
    service.statusCount().then((res) => {
      if (res.status) {
        setCountData(res.data);
      }
    });
  };

  const tabsOnchange = (value: any) => {
    setSelectedTabKey(value);
    setTabName(value);
    getData(value);
  };

  const columns: any = [
    {
      title: 'S.No',
      render: (val, record, index) => index + 1,
    },
    {
      title: 'Trim Number',
      dataIndex: 'trim_swatch_number',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (createdAt) => {
        const date = new Date(createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
    {
      title: 'GRN Number',
      dataIndex: 'grn_number',
    },
    {
      title: 'GRN Date',
      dataIndex: 'grn_date',
      render: (grnDate) => {
        const date = new Date(grnDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
    {
      title: 'Buyer',
      dataIndex: 'buyerName',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
    },
    {
      title: 'Po No',
      dataIndex: 'po_number',
    },
    {
      title: 'Style No',
      dataIndex: 'style_no',
    },
    {
      title: 'Item No',
      dataIndex: 'item_no',
    },
    {
      title: 'Item Descrpition',
      dataIndex: 'item_description',
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    // },
    {
      title: <div style={{textAlign:"center"}}>Action</div>,
      dataIndex: 'action',
      align:'center',
      render: (text, rowData) => {
        return(
          <span>
          <Tooltip placement="top" title="Detail View">
            
            <EyeOutlined  onClick={() => {
                                navigate(`/trims-swatch-detail-view/${rowData.trim_swatch_id}`)
                            }}
                            style={{ color: "blue", fontSize: 20  }}
            />
            {/* <Divider type='vertical' /> */}
          </Tooltip>
          </span> 
        )
    },
    },
    {
      title:'Rejection Reason',
      dataIndex: 'rejection_reason'
    },
    {
      title:'Rework Reason',
      dataIndex: 'rework_reason'
    }
  ]

  const onReset = () => {
    form.resetFields();
    // getData(tabName);
  };

  const columnColor = (record: any) => {
    return record.check_out_status === 'OPEN' ? 'open' : '';
  };

  const onModalCancel = () => {
    onReset()
    setModal(false);
  };
  function gotoGrid() {
    navigate('/trims-swatch-upload');
  }

  return (
    <Card
      title={<span>Trims Approval</span>}
      style={{ textAlign: 'center' }}
      headStyle={{ backgroundColor: '#25529a', color: 'white' }}
      extra={
        (userRole === 'ADMIN' || (department === 2 && userRole === 'STORES'))&&(<span style={{ color: 'white' }}>
          <Button onClick={gotoGrid}>Create</Button>{' '}
        </span>)
      }
      >
      <Tabs 
      onChange={tabsOnchange} 
      activeKey={activeKey}
      >
        <TabPane
          key={StatusEnum.SENT_FOR_APPROVAL}
          tab={<span style={{color:'#d4b417'}}>WAITING FOR APPROVAL : {countData[0]?.openCount}</span>}

        >
          {data.length > 0 ?(
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            scroll={{ x: true }}
            columns={columns.filter(
                (o) => !['rework_reason','rejection_reason','po_number','grn_number','grn_date','item_description','style_no'].includes(o.dataIndex)
              )}
            dataSource={data}
            size="small"
            bordered
          />):(
            <Alert 
            message="No data available☹️" 
            type="info" 
            showIcon
            style={{ width: "160px", margin: "auto" }}/>
          )}
        </TabPane>
        <TabPane
          key={StatusEnum.APPROVED}
          tab={<span style={{ color: 'green' }}>APPROVED : {countData[0]?.approvedCount}</span>}

        >
          {data.length > 0 ?(
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            rowClassName={columnColor}
            scroll={{ x: 'max-content' }}
            columns={columns.filter(
                (o) => !['rejection_reason','action' ,'rework_reason'].includes(o.dataIndex)
              )}
            dataSource={data}
            size="small"
            bordered
          ></Table>):(
            <Alert 
            message="No data available☹️" 
            type="info" 
            showIcon
            style={{ width: "160px", margin: "auto" }}/>
          )}
        </TabPane>
        <TabPane
          key={StatusEnum.REJECTED}
          tab={<span style={{ color: 'red'}}>REJECTED : {countData[0]?.rejectedCount}</span>}
        >
          { data.length > 0 ? (
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            scroll={{ x: true }}
            columns={columns.filter(
              (o) => !['action','rework_reason'].includes(o.dataIndex)
            )}
            dataSource={data}
            size="small"
            bordered
          ></Table>):(
            <Alert 
            message="No data available☹️" 
            type="info" 
            showIcon
            style={{ width: "160px", margin: "auto" }}/>
          )}
        </TabPane>
        <TabPane  
        key={StatusEnum.REWORK}
        tab = { <span style={{ color: 'orange'}}>REWORK : {countData[0]?.reworkCount} </span> }
        >
          {data.length > 0 ? (
            <Table 
            pagination = {{
              onChange(current) { setPage(current) },
            }}
            scroll={{ x: true }}
            columns = {columns.filter((o) => !['rejection_reason'].includes(o.dataIndex))}
            dataSource = {data}
            size = 'small'
            bordered
            ></Table>):(
              <Alert
              message = "No data available☹️" 
              type="info" 
              showIcon
              style={{ width: "160px", margin: "auto" }}/>
            )}
        </TabPane>
      </Tabs>
      {/* <Modal
        visible={modal}
        onCancel={onModalCancel}
        footer={null}
        style={{ maxWidth: '90%' }}
        destroyOnClose
        >
          {action === 'image' ? (
            <img src={imagePath} alt="Trim Image" style={{ maxWidth: '100%' }} />
          ):null}

        {action === 'reject' ? (<Card
            title={'Reject'}
            size='small'
            headStyle={{ backgroundColor: '#7d33a2', color: 'white',textAlign:'center' }}
            >
            <Form form={form} layout='vertical' 
            onFinish={handleFormSubmit}
            >
                <Row gutter={16}>
                <Col xl={12} lg={12} xs={10}>
                    <Form.Item name='rejectionReason' label='Reason' rules={[{ required: true, message: 'Reason is required' }]}>
                    <TextArea rows={2} placeholder='Enter Reason' />
                    </Form.Item>
                </Col>
                </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  htmlType="button"
                  style={{ margin: '0 14px' }}
                  onClick={onReset}
                >
                  Reset
                </Button>
              </Col>
            </Row>
            </Form>
        </Card>): null}
        </Modal> */}
    </Card>
  );
};

export default TrimSwatchApproval;
