import React, { useEffect, useRef, useState } from 'react';
import {Alert,Button,Card,Checkbox,Col,DatePicker,Divider,Drawer,Form,Image,Input,Modal,Popconfirm,Row,Segmented,Select,Spin,Table,Tabs,Tag,Tooltip,Upload,message, notification} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {EditOutlined, EyeOutlined,SyncOutlined,SearchOutlined , DeleteOutlined} from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import Highlighter from 'react-highlight-words';
import { DateReq, EmailModel, StatusEnum, SwatchStatus, TrimSwatchStatus } from 'libs/shared-models';
import { EmailService, FabricSwatchService, TrimSwatchService } from 'libs/shared-services';
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
  const mailService = new EmailService()
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const userRole = createUser.role;
  const department = createUser.departmentId
  const [ dataById, setDataById ] = useState<any[]>([])
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');





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
    getSwatchDetails(viewData)

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
    setFileList([])
    form.resetFields()
  }

  function onFinish(values) {
    createUpload(values);
    // sendMailForApprovalUser();
  }

  let mailerSent = false;
  async function sendMailForApprovalUser() {
    const swatchDetails = new EmailModel();
    swatchDetails.swatchNo = selectedData.trim_swatch_number
    // swatchDetails.to = 'kushal.siddegowda@shahi.co.in';
    swatchDetails.to = selectedData.emailId 
    // TODO:
    swatchDetails.html = `
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        #acceptDcLink {
              display: inline-block;
              padding: 10px 20px;
              background-color: #28a745;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 10px;
              transition: background-color 0.3s ease, color 0.3s ease;
              cursor: pointer;
          }
  
          #acceptDcLink.accepted {
              background-color: #6c757d;
              cursor: not-allowed;
          }
  
          #acceptDcLink:hover {
              background-color: #218838;
              color: #fff;
          }
      </style>
    </head>
    <body>
    <p>Dear team,</p>
    <p>Please find the Reworked 🔂 Trim Swatch details below:</p>
    <p>Trim Swatch No: ${selectedData?.trim_swatch_number}</p>
    <p>Buyer: ${selectedData?.buyerName}</p>
    <p>Supplier: ${selectedData?.supplier_name }</p>
    <p>Style No: ${selectedData?.style_no }</p>
    <p>Item No: ${selectedData?.item_no}</p>
    <p>Please click the link below for details:</p>

    <a
      href="http://dsw7.shahi.co.in/#/trims-swatch-detail-view/${selectedData?.trim_swatch_id}"
      style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      "
      >View Details of ${selectedData?.trim_swatch_number}</a
    >

  </body>
  </html>
  `
    swatchDetails.subject = "Trim Swatch : " +  selectedData?.trim_swatch_number
    const res = await mailService.sendSwatchMail(swatchDetails)
    if (res.status == 201) {
        if (res.data.status) {
            message.success("Mail sent successfully")
            mailerSent = true;
        } else {
            message.success("Mail sent successfully")
        }
    } else {
        message.success(`Alert Mail Sent to ${selectedData.emailId} `)
    }
}


const getColumnSearchProps = (dataIndex: string) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Button
        type="primary"
        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
        icon={<SearchOutlined />}
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button
        size="small"
        style={{ width: 90 }}
        onClick={() => {
          handleReset(clearFilters);
          setSearchedColumn(dataIndex);
          confirm({ closeDropdown: true });
        }}
      >
        Reset
      </Button>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined
      type="search"
      style={{ color: filtered ? '#1890ff' : undefined }}
    />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      : false,
  onFilterDropdownVisibleChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current.select());
    }
  },
  render: (text) =>
    text ? (
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#faf8f5', padding: 0 }}
          // '#e8e4df'
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
    ) : null,
});
function handleSearch(selectedKeys, confirm, dataIndex) {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
}

function handleReset(clearFilters) {
  clearFilters();
  setSearchText('');
}


  function createUpload(values) {
    if (fileList.length > 0) {
      // console.log(form.getFieldValue('remarks'),'...................')
      const req = new TrimSwatchStatus(selectedData.trim_swatch_id,undefined,undefined,undefined,undefined,form.getFieldValue('remarks'))
      service.reworkSentForApproval(req).then((res) => {
        if (res.status) {
          if (fileList.length > 0) {
            const formData = new FormData();
            // fileList.forEach((file: any) => {
            //   formData.append('file', file);
            // });
            for(const file of fileList){
              formData.append('file', file.originFileObj);
            }
            formData.append('trimSwatchId', `${res.data.trimSwatchId}`);
            // console.log(res.data.trimSwatchId,'-------id')
            service.photoUpload(formData).then((fileres) => {
              if (res.status) {
                form.setFieldsValue({trimSwatchNumber: res?.data?.trimSwatchNumber})
                form.setFieldsValue({trimSwatchId: res?.data?.trimSwatchId})
                setResData(res.data)
                res.data.filePath = fileres.data;
                sendMailForApprovalUser()
                message.success(res.internalMessage,2)
                onReset();
                setDrawerVisible(false)
                setFileList([])
                getCount()
                getData(tabName)
                setModal(false)
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

  const handleDeleteImage = (value)=>{
    const req = new TrimSwatchStatus(value.uploadId,undefined)
    service.deleteImage(req).then((res)=>{
      if(res.status){
        message.success(res.internalMessage,2)
        setDataById(prevData => prevData.filter(item => item.uploadId !== value.uploadId));
      }else{
        message.error(res.internalMessage,2)
      }
    })
  }

  const getSwatchDetails = (value) => {
    const req = new TrimSwatchStatus(value.trim_swatch_id, undefined, undefined);
    service.getDataById(req).then((res) => {
      if (res.status) {
        setDataById(res.data);
      }
    });
  };


  const columns: any = [
    {
      title: 'S.No',
      render: (val, record, index) => index + 1,
      
    },
    {
      title: 'Trim Number',
      dataIndex: 'trim_swatch_number',
      ...getColumnSearchProps('trim_swatch_number'),

    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      ...getColumnSearchProps('createdAt'),
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
      ...getColumnSearchProps('grn_number'),

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
      ...getColumnSearchProps('buyerName'),

    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      ...getColumnSearchProps('supplier_name'),

    },
    {
      title: 'Po No',
      dataIndex: 'po_number',
      ...getColumnSearchProps('po_number'),
    },
    {
      title: 'Style No',
      dataIndex: 'style_no',
      ...getColumnSearchProps('style_no'),

    },
    {
      title: 'Item No',
      dataIndex: 'item_no',
      ...getColumnSearchProps('item_no'),

    },
    {
      title: 'Item Descrpition',
      dataIndex: 'item_description',
      ...getColumnSearchProps('item_description'),

    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
      ...getColumnSearchProps('invoice_no'),

    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    // },
    {
      title:'Remarks',
      dataIndex:`${tabName === 'REWORK'? 'reworkReason' : tabName === 'REJECTED' ? 'rejection_reason' : tabName === 'APPROVED' ? 'approvalReason': tabName === 'SENT_FOR_APPROVAL' ? 'remarks' : '-'}`,
      ...getColumnSearchProps(`${tabName === 'REWORK'? 'reworkReason' : tabName === 'REJECTED' ? 'rejection_reason' : tabName === 'APPROVED' ? 'approvalReason': tabName === 'SENT_FOR_APPROVAL' ? 'remarks' : '-'}`),
      render:(text)=>{
        return text || '-'
      }
    },
    {
      title: 'Reworked',
      dataIndex: 'rework',
      render:(text)=>{
        return text || '-'
      },
      onFilter: (value, record) => {
        return record.rework.includes(value);
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown" style={{ flexDirection: 'row', marginLeft: 10 }}>
          <Checkbox
            checked={selectedKeys.includes('YES')}
            onChange={() => setSelectedKeys(selectedKeys.includes('YES') ? [] : ['YES'])}
          >
            <span style={{ color: 'green' }}>YES</span>
          </Checkbox>
          <Checkbox
            checked={selectedKeys.includes('NO')}
            onChange={() => setSelectedKeys(selectedKeys.includes('NO') ? [] : ['NO'])}
          >
            <span style={{ color: 'red' }}>NO</span>
          </Checkbox>
          <div className="custom-filter-dropdown-btns">
            <Button onClick={() => {
              handleReset(clearFilters);
              confirm({ closeDropdown: true });
            }} className="custom-reset-button">
              Reset
            </Button>
            <Button type="primary" style={{ margin: 10 }} onClick={() => confirm()} className="custom-ok-button">
              OK
            </Button>
          </div>
        </div>
      ),
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

  const onSubmit = () =>{
    if(fileList.length > 0 && form.getFieldValue('remarks') != undefined){
    setModal(true)
    }else{
      notification.info({ message: 'Please upload at least one Image and Enter remarks' })
    }
  }

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  const getBase64 = file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  };


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
                (o) => !['rejection_reason' ,'rework_reason','edit'].includes(o.dataIndex)
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
              (o) => !['rework_reason','edit'].includes(o.dataIndex)
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
            columns = {columns.filter((o) => !['',].includes(o.dataIndex))}
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
                <Row gutter={16}>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 18 }} lg={{ span: 15 }} xl={{ span: 4 }}>
                  <Form.Item label={'Trim Image'} required={true}>
                    <Upload
                    {...uploadFieldProps}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    style={{ width: '200px', height: '200px' }}
                    accept=".png,.jpeg,.PNG,.jpg,.JPG"
                    >
                      {uploading ? <SyncOutlined spin /> : (fileList.length < 3 && '+ Upload')}
                    </Upload>
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                          visible: previewVisible,
                          onVisibleChange: (visible) => {
                            setPreviewVisible(visible);
                            if (!visible) {
                              // Reset preview image when modal is closed
                              setPreviewImage('');
                            }
                          },
                        }}
                        src={previewImage}
                      />
                  </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:6}}>
                <Form.Item
                      label="Remarks"
                      name={'remarks'}
                      rules={[{ required: true, message: 'Please input Remarks' }]}
                    >
                      <TextArea rows={4} placeholder="Enter Remarks" />
                    </Form.Item>
                </Col>
                </Row>
                <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary"  onClick={onSubmit}>
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
        <Modal
          title="Previous Uploaded Images"
          visible={modal}
          onCancel={() => setModal(false)}
          footer={[
            // Submit button inside modal footer
            <Popconfirm
              title="Are you sure to Submit?"
              onConfirm={onFinish}
              okText="Yes"
              cancelText="No"
            >
            <Button key="submit" type="primary">
              Submit
            </Button>
            </Popconfirm>
            ]}
        >
        <p style={{padding:'5px' , color: 'red'}}>If want to delete existing uploaded images.., Please Click Delete Button </p>
        <Image.PreviewGroup>
          {dataById.map((item, index) => (
            <div key={index} style={{ position: 'relative', marginRight: '10px', display: 'inline-block' }}>
              <div style={{ position: 'relative' }}>
                <Image
                  src={`http://dsw7.shahi.co.in/services/kanban-service/upload-files/${item?.file_name}`}
                  alt={`Preview`}
                  height={'100px'}
                  width={'280px'}
                  style={{
                    width: '100%',
                    objectFit: 'contain',
                    padding : '6px',
                  }}
                />
                <Popconfirm
              title="Are you sure to delete this image?"
              onConfirm={() => handleDeleteImage(item)} // handleDeleteImage is your delete image handler function
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '20px', // Increase the size of the delete icon
                }}
              />
            </Popconfirm>
              </div>
            </div>
          ))}
        </Image.PreviewGroup>
        </Modal>
        </Drawer>
    </Card>
    </>
  );
};

export default TrimSwatchApproval;
