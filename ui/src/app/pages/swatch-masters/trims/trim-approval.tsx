import React, { useEffect, useRef, useState } from 'react';
import {Alert,Button,Card,Col,DatePicker,Divider,Drawer,Form,Input,Modal,Popconfirm,Row,Segmented,Select,Table,Tabs,Tag,Tooltip,message} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
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
  const [tabName, setTabName] = useState<string>('SENT FOR APPROVAL');
  const [countData, setCountData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null); 
  const [modal, setModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({});
  const [activeKey, setActiveKey] = useState('SENT FOR APPROVAL')
  const service = new TrimSwatchService()
  const [imagePath, setImagePath] = useState('');
  const [action, setAction] = useState(null);


  useEffect(() => {
    setActiveKey(tabName);
  }, [tabName]);

  useEffect(() => {
    getData(tabName);
    getCount();
  }, []);

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
    setTabName(value);
    getData(value);
  };


  const fabricAccepted = (value)=>{
    console.log(value,',,,,,,,,,,,,,,,,,,,,')
    const req = new SwatchStatus(value?.fabricSwatchId,value?.fabricSwatchNo)
    service.updateApprovedStatus(req).then((res)=>{
        if(res.status){
            message.success(res.internalMessage,2)
            setTabName('APPROVED')
            setActiveKey('APPROVED');
            getData('APPROVED')
            getCount()
        }else{
            message.error(res.internalMessage,2)
        }
    })
  }

  const fabricRejected =(value)=>{
    console.log(value,'.......................')
    const req = new SwatchStatus(value,undefined,form.getFieldValue('rejectionReason'))
    service.updateRejectedStatus(req).then((res)=>{
        if(res.status){
            message.success(res.internalMessage,2)
            setTabName('REJECTED')
            setActiveKey('REJECTED');
            getData('REJECTED')
            getCount()
            setModal(false)
            onReset()
        }else{
            message.error(res.internalMessage,2)
        }
    })
  }

  const handelReject = (value)=>{
    setAction('reject')
    setFormData(value?.fabricSwatchId)
    setModal(true)
  }

  const handleFormSubmit = () => {
    fabricRejected(formData);
  };

  // const DetailView = (value) => {
  //   return (
  //     navigate(`/fabric-swatch-detail-view`,{state:{data: value}})
  //   )
  // }

  const openImage = (record) => {
    setAction('image')
    setImagePath(record?.filePath);
    setModal(true);
};
  const columns: any = [
    {
      title: 'S.No',
      render: (val, record, index) => index + 1,
    },
    {
      title: 'Swatch Number',
      dataIndex: 'fabricSwatchNo',
    },
    {
      title: 'Buyer',
      dataIndex: 'buyerName',
    },
    {
      title: 'Brand',
      dataIndex: 'brandName',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
    },
    {
      title: 'Season',
      dataIndex: 'seasonName',
    },
    {
      title: 'Style No',
      dataIndex: 'styleNo',
    },
    {
      title: 'Item No',
      dataIndex: 'itemNo',
    },
    {
      title: 'Category Type',
      dataIndex: 'categoryType',
    },
    {
      title: 'PO No',
      dataIndex: 'poNumber',
    },
    {
      title: 'GRN No',
      dataIndex: 'grnNumber',
    },
    {
      title: 'GRN Date',
      dataIndex: 'grnDate',
      render: (grnDate) => {
        const date = new Date(grnDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
    {
      title: 'Item Description',
      dataIndex: 'itemDescription',
    },
    {
      title: 'Mill/Vendor',
      dataIndex: 'mill',
    },
    {
      title:'Image',
      dataIndex:'',
      render:(text,record)=>{
        return(
          <Button type="link" onClick={() => openImage(record)}>
            <FileImageOutlined />
          </Button>
        )
      }
    },
    {
      title: <div style={{textAlign:"center"}}>Action</div>,
      dataIndex: 'action',
      render: (text, rowData) => {
        return(
          // <span>
          // <Tooltip placement="top" title="Detail View">
            
          //   <EyeOutlined  onClick={() => DetailView(rowData.fabricSwatchId)} style={{color:'blue',fontSize:15}} size={20}/>
          // </Tooltip>
          // </span>
        <div style={{ textAlign: 'center' }}>
            <Popconfirm
              title="Are you sure to accept?"
              onConfirm={() => fabricAccepted(rowData)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">ACCEPT</Button>
            </Popconfirm>
            <Divider type='vertical'/>
            <Button type="primary" danger onClick={() => handelReject(rowData)}>REJECT</Button>
        </div>
        )
    },
    },
    {
      title:'Rejection Reason',
      dataIndex: 'rejectionReason'
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

  return (
    <Card
      title={<span>Trims Approval</span>}
      style={{ textAlign: 'center' }}
      headStyle={{ backgroundColor: '#7d33a2', color: 'white' }}
      >
      <Tabs 
      onChange={tabsOnchange} 
      activeKey={activeKey}
      >
        <TabPane
          key={StatusEnum.OPEN}
          tab={`OPEN : ${countData[0]?.openCount}`}
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
                (o) => !['rejectionReason'].includes(o.dataIndex)
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
          tab={`APPROVED : ${countData[0]?.approvedCount}`}
        >
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            rowClassName={columnColor}
            scroll={{ x: 'max-content' }}
            columns={columns.filter(
                (o) => !['rejectionReason','action'].includes(o.dataIndex)
              )}
            dataSource={data}
            size="small"
            bordered
          ></Table>
        </TabPane>
        <TabPane
          key={StatusEnum.REJECTED}
          tab={`REJECTED : ${countData[0]?.rejectedCount}`}
        >
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            scroll={{ x: true }}
            columns={columns.filter(
              (o) => !['action'].includes(o.dataIndex)
            )}
            dataSource={data}
            size="small"
            bordered
          ></Table>
        </TabPane>
      </Tabs>
      <Modal
        visible={modal}
        onCancel={onModalCancel}
        footer={null}
        style={{ maxWidth: '90%' }}
        destroyOnClose
        >
          {action === 'image' ? (
            <img src={imagePath} alt="Fabric Image" style={{ maxWidth: '100%' }} />
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
        </Modal>
    </Card>
  );
};

export default TrimSwatchApproval;
