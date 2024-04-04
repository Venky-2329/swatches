import React, { useEffect, useRef, useState } from 'react';
import {Alert,Button,Card,Col,DatePicker,Divider,Drawer,Form,Input,Modal,Popconfirm,Row,Segmented,Select,Spin,Table,Tabs,Tag,Tooltip,Upload,message, notification} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {EditOutlined, EyeOutlined,SyncOutlined} from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import Highlighter from 'react-highlight-words';
import { DateReq, StatusEnum, SwatchStatus, TrimSwatchStatus } from 'libs/shared-models';
import { FabricSwatchService, TrimSwatchService } from 'libs/shared-services';
import TextArea from 'antd/es/input/TextArea';
import imageCompression from 'browser-image-compression';


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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(undefined);
  const [fileList, setFileList] = useState<any[]>([]);
  const [ resData, setResData ] = useState<any[]>([])
  const createUser = JSON.parse(localStorage.getItem('auth'));
  const [uploading, setUploading] = useState(false);
  const [reason , setReason ] = useState('')
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
  const handleRemove = (file) => {
    const updatedFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(updatedFileList);
  };

  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 5, // Adjust the maximum size as needed
        // maxWidthOrHeight: 1920, // Adjust the maximum width or height as needed
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
      });
      return compressedFile;
    } catch (error) {
      throw error;
    }
  };

  const handleBeforeUpload = async (file) => {
    setUploading(true)
    if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
      notification.info({ message: 'Only png, jpeg, jpg files are allowed!' });
      return true;
    }

    try {
      const compressedImage = await compressImage(file);

      if (fileList.length == 3) {
        notification.info({
          message: 'You Cannot Upload More Than Three File At A Time',
        });
        return true;
      } else {
        setUploading(false)
        setFileList([...fileList, compressedImage]);
        return false;
      }
    } catch (error) {
      return true; // Returning true to prevent uploading if an error occurs
    }
  };

  const uploadFieldProps = {
    multiple: true,
    onRemove: handleRemove,
    beforeUpload: handleBeforeUpload,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList: fileList,
  };

  const openFormWithData=(viewData)=>{
    setDrawerVisible(true);
    setSelectedData(viewData);
  }

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

  const closeDrawer=() =>{
    setDrawerVisible(false)
  }

  function onFinish(values) {
    createUpload(values);
  }



  function createUpload(values) {
    if (fileList.length > 0) {
      console.log(values,'...................')
      const req = new TrimSwatchStatus(selectedData.trim_swatch_id)
      console.log(req.trimSwatchId , '=========id')
      service.reworkSentForApproval(req).then((res) => {
        console.log(res.data)
        if (res.status) {
          if (fileList.length > 0) {
            const formData = new FormData();
            fileList.forEach((file: any) => {
              formData.append('file', file);
            });
            formData.append('trimSwatchId', `${res.data.trimSwatchId}`);
            // console.log(res.data.trimSwatchId,'-------id')
            service.photoUpload(formData).then((fileres) => {
              if (res.status) {
                form.setFieldsValue({trimSwatchNumber: res?.data?.trimSwatchNumber})
                form.setFieldsValue({trimSwatchId: res?.data?.trimSwatchId})
                setResData(res.data)
                res.data.filePath = fileres.data;
                // sendMailForApprovalUser()
                message.success(res.internalMessage,2)
                onReset();
                setDrawerVisible(false)
                setFileList([])
                getCount()
                getData(tabName)
              } else {
                message.error(res.internalMessage,2)
              }
            });
          }
        } else {
          notification.info({
            message: res.internalMessage,
            placement: 'top',
            duration: 1,
          });
        }
      });
    } else {
      return notification.info({ message: 'Please upload sample' });
    }
  }


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
      title:'Remarks',
      dataIndex:`${tabName === 'REWORK'? 'reworkReason' : tabName === 'REJECTED' ? 'rejected_reason' : tabName === 'APPROVED' ? 'approvalReason': tabName === 'SENT_FOR_APPROVAL' ? 'remarks' : '-'}`,
      render:(text)=>{
        return text || '-'
      }
    },
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
      title: <div style={{textAlign:"center"}}>Action</div>,
      dataIndex: 'edit',
      align:'center',
      render: (text, rowData) => {
        return(
          <span>
                    <Tooltip placement="top" title="Edit">
                    <EditOutlined  className={'editSampleTypeIcon'}  type="edit" 
                        onClick={() => openFormWithData(rowData)}
                        style={{ color: '#1890ff', fontSize: '14px' }}
                      />
                    </Tooltip>
          </span>
        )
    },
  }

  ]

  const onReset = () => {
    form.resetFields();
    setFileList([])
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
    <>
     {uploading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000, // Adjust the z-index as needed
            }}
          >
            <Spin size="large" />
            <div style={{ marginLeft: 10 }}> Uploading...</div>
          </div>
        )}
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
                (o) => !['reason','po_number','grn_number','grn_date','item_description','style_no','edit'].includes(o.dataIndex)
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
                (o) => !['rejection_reason','action' ,'rework_reason','edit'].includes(o.dataIndex)
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
              (o) => !['action','rework_reason','edit'].includes(o.dataIndex)
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
            columns = {columns.filter((o) => !['rejection_reason','action'].includes(o.dataIndex))}
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
      <Drawer bodyStyle={{ paddingBottom: 80 }} title={selectedData?.trim_swatch_number} width={window.innerWidth > 768 ? '50%' : '85%'}
        onClose={closeDrawer} visible={drawerVisible} closable={true}>
        <Card>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 18 }} lg={{ span: 15 }} xl={{ span: 15 }}>
                  <Form.Item label={'Trim Image'} required={true}>
                    <Upload
                    {...uploadFieldProps}
                    listType="picture-card"
                    fileList={fileList}
                    // onPreview={onPreview}
                    style={{ width: '200px', height: '200px' }}
                    accept=".png,.jpeg,.PNG,.jpg,.JPG"
                    // onChange={handleChange}
                    >
                      {uploading ? <SyncOutlined spin /> : (fileList.length < 3 && '+ Upload')}
                    </Upload>
                  </Form.Item>
                </Col>
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
              </Form>
        </Card>
        </Drawer>
    </Card>
    </>
  );
};

export default TrimSwatchApproval;
