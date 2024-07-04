import React, { useState, useEffect } from 'react';
import {Form,Input,Button,Select,DatePicker,Upload,message,Card,Col,Row,notification,Image,Spin,Segmented, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import imageCompression from 'browser-image-compression';
import { SyncOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { BuyerReq, EmailModel } from 'libs/shared-models';
import { BuyerService, SupplierService, TrimSwatchService, EmailService, ApprovalUserService, ExcelBotService } from 'libs/shared-services';
import '../fabric-swatch/fabric-swatch.css'
import './trims.css'
const { TextArea } = Input;
const { Option } = Select;

export function TrimSwatchUpload() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);
  const [buyer, setBuyer] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const users: any = JSON.parse(localStorage.getItem('auth'));
  const createdUser = users.userName;
  const createdUserMail = users.userMail;
  const service = new BuyerService();
  const service2 = new SupplierService();
  const mainService = new TrimSwatchService();
  const mailService = new EmailService();
  const employeeService = new ApprovalUserService();
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [resData, setResData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [tabName, setTabName] = useState<string | number>('manual');
  const [buyerData, setBuyerData] = useState<any[]>([])
  const [buyerCodeData, setBuyerCodeData] = useState<any[]>([])
  const excelService = new ExcelBotService()
  const [ itemCodeData, setItemCodeData ] = useState<any[]>([])

  const [ itemDesc, setItemDesc ] = useState([])

  useEffect(() => {
    getBuyers();
    getSupplier();
    getEmployeeData();
    getGrpBuyers()
  }, []);

  function getBuyers() {
    service.getAllActiveBuyers().then((res) => {
      if (res.data) {
        setBuyer(res.data);
      }
    });
  }

  const getGrpBuyers = ()=>{
    service.getBuyers().then((res)=>{
      if(res.status){
        setBuyerData(res.data)
      }
    })
  }

  const getBuyerByName = (value)=>{
    const req = new BuyerReq(null,null,null,value,null)
    service.getBuyerCodeByName(req).then((res)=>{
      if(res.status){
        setBuyerCodeData(res.data)
      }
    })
  }

  const [isLoading, setIsLoading] = useState(false);

  const getItemCodesByBuyer = (buyerName, buyerCode) => {
    setIsLoading(true);
    setItemCodeData([]);
    const req = new BuyerReq(undefined, undefined, undefined, buyerName, buyerCode);
    excelService.getItemCodesByBuyer(req).then((res) => {
      if (res.status) {
        setItemCodeData(res.data);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  const getItemDesByCode = (value) => {
    const req = new BuyerReq(undefined, undefined, undefined, undefined, value);
    excelService.getItemDesByCode(req).then((res) => {
      if (res.status) {
        setItemDesc(res.data);
      }
    })
  }

  const [ poData,setPOData ] = useState<any[]>([])
  const getPODataByItemCode = (value) => {
    const req = new BuyerReq(undefined, undefined, undefined, undefined, value);
    excelService.getPODataByItemCode(req).then((res) => {
      if (res.status) {
        setPOData(res.data);
      }
    })
  }

  const onBuyerOrCodeChange = (value, type) => {
    if (tabName !== 'manual') {
      if (type === 'name') {
        getBuyerByName(value);
        form.setFieldsValue({ buyerCode: undefined });
        form.setFieldsValue({ 
          buyerCode: undefined,
          items: form.getFieldValue('items')?.map(item => ({
            ...item,
            itemNo: undefined
          }))
        });
        setItemCodeData([]); 
      }
      getItemCodesByBuyer(type === 'name' ? value : form.getFieldValue('buyerId'), type === 'code' ? value : undefined);
    } else {
      if (type === 'name') {
        form.setFieldsValue({ buyerName: value });
      }
    }
  };

  const onBuyerChange = (value) => {
    onBuyerOrCodeChange(value, 'name');
  };

  const onBuyerCodeChange = (value) => {
    onBuyerOrCodeChange(value, 'code');
  };


  const handleItemNoChange = (value, name) => {
    form.setFields([
      { name: [name, 'itemDescription'], value: undefined },
      { name: [name, 'poNumber'], value: undefined },
      { name: [name, 'itemNo'], value: value },
      { name: [name, 'grnNumber'], value: undefined }
    ]);
    
    setItemDesc([]);
    setPOData([]);
    getItemDesByCode(value);
    getPODataByItemCode(value);
  };

  const handleItemDescriptionChange = (value, name) => {
    form.setFieldValue([name, 'itemDescription'], value);
  };
  
  const handlePONumberChange = (value, name) => {
    form.setFieldValue([name, 'poNumber'], value);
  };
  
  const handleGRNNumberChange = (value, name) => {
    form.setFieldValue([name, 'grnNumber'], value);
  };
  
  const handleSupplierChange = (value, name) => {
    form.setFieldValue([name, 'supplier'], value);
  };
  
  const handleInvoiceChange = (value, name) => {
    form.setFieldValue([name, 'invoiceNo'], value);
  };

  function getSupplier() {
    service2.getAllActiveSuppliers().then((res) => {
      if (res.data) {
        setSupplier(res.data);
      }
    });
  }

  function onReset() {
    form.resetFields();
    setFileList([]);
  }

  function onFinish(values) {
    createUpload(values);
  }

  const getEmployeeData = () => {
    employeeService.getAllActiveApprovalUser().then((res) => {
      if (res.status) {
        setEmployeeData(res.data);
      }
    });
  };

  const handleRemove = (file) => {
    const updatedFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(updatedFileList);
  };

  const onUserChange = (value, option) => {
    form.setFieldsValue({ approverName: option?.name });
    form.setFieldsValue({ approverMail: option?.mail });
  };

  const handleBeforeUpload = async (file) => {
    setUploading(true);
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
        setFileList([...fileList, compressedImage]);
        setUploading(false);

        return false;
      }
    } catch (error) {
      return true; // Returning true to prevent uploading if an error occurs
    }
  };

  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 5,
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

  function createUpload(values) {
    if (fileList.length > 0) {
      mainService.createTrimSwatch(values).then((res) => {
        if (res.status) {
          if (fileList.length > 0) {
            const formData = new FormData();
            for (const file of fileList) {
              formData.append('file', file.originFileObj);
            }
            formData.append('trimSwatchId', `${res.data.trimSwatchId}`);
            mainService.photoUpload(formData).then((fileres) => {
              if (res.status) {
                form.setFieldsValue({ trimSwatchNumber: res?.data?.trimSwatchNumber });
                form.setFieldsValue({ trimSwatchId: res?.data?.trimSwatchId });
                setResData(res.data);
                res.data.filePath = fileres.data;
                sendMailForApprovalUser();
                message.success(res.internalMessage, 2);
                gotoGrid();
              } else {
                message.error(res.internalMessage, 2);
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

  function gotoGrid() {
    navigate('/trims-swatch-approval');
  }

  let mailerSent = false;
  async function sendMailForApprovalUser() {
      const swatchDetails = new EmailModel();
      swatchDetails.swatchNo = form.getFieldValue('trimSwatchNumber');
      // swatchDetails.to = 'kushal.siddegowda@shahi.co.in';
      swatchDetails.to = form.getFieldValue('approverMail')
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
        <p>Please find the Trim Swatch details below:</p>
        <p>Trim Swatch No: ${form.getFieldValue('trimSwatchNumber')}</p>
        <p>Buyer: ${form.getFieldValue('buyerName')}</p>
        <p>Supplier: ${form.getFieldValue('supplierName')}</p>
        <p>Style No: ${form.getFieldValue('styleNo')}</p>
        <p>Item No: ${form.getFieldValue('itemNo')}</p>

        <p>Please click the link below for details:</p>
        <input type="hidden" id="assignBy" value=${form.getFieldValue('assignBy')} /> 
        <input type="hidden" id="dcId" value=${form.getFieldValue('dcId')} />
    
        <a
        href="http://dsw7.shahi.co.in/#/trims-swatch-detail-view/${form.getFieldValue('trimSwatchId')}"
        style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          "
          >View Details of ${form.getFieldValue('trimSwatchNumber')} </a
        >
      
      </body>
    </html>
    `
      swatchDetails.subject = "Trim Swatch : " + form.getFieldValue('trimSwatchNumber')
      const res = await mailService.sendSwatchMail(swatchDetails)
      if (res.status == 201) {
          if (res.data.status) {
              message.success("Mail sent successfully")
              mailerSent = true;
          } else {
              message.success("Mail sent successfully")
          }
      } else {
          message.success(`Alert Mail Sent to ${form.getFieldValue('approverMail')}`)
      }
  }


  const onSupplierChange = (value, option) => {
    form.setFieldsValue({ supplierName: option?.name });
  };

  const handleTabChange = (value) => {
    setTabName(value);
    form.setFieldsValue({ items: [{}] });
    form.resetFields( )
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
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
          <div style={{ marginLeft: 10 }}> Uploading...</div>
        </div>
      )}
      <Card
        title="Trim Swatch"
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        extra={
          <span>
            <Button onClick={gotoGrid}>View</Button>
          </span>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row> 
            <Segmented size='large' options={[{ label:'👨🏻‍💻Manual',value: 'manual' },{ label:'🤖Auto', value: 'auto' }]} value={tabName} onChange={handleTabChange}/>
          </Row>
          <br />

          {/* Conditional rendering based on tabName */}
          {tabName === 'manual' ? (
            <>
              <Row gutter={24} style={{marginTop:'-15px'}}>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item
                    label="Buyer"
                    name={'buyerId'}
                    rules={[{ required: true, message: 'Buyer is required' }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="Select Buyer"
                      onChange={onBuyerChange}
                    >
                      {buyer.map((item) => (
                        <Option key={item.buyerId} value={item.buyerId} name={item.buyerName}>{item.buyerName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Form.Item hidden name={'buyerName'}></Form.Item>
                <Form.Item hidden name={'trimSwatchId'}></Form.Item>
                <Form.Item hidden name={'trimSwatchNumber'}></Form.Item>

                <Col  xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item name={'createdUser'} initialValue={createdUser} label={'Created By'}>
                    <Input defaultValue={createdUser} disabled/>
                  </Form.Item>
                  <Form.Item name={'createdUserMail'} initialValue={createdUserMail} hidden>
                    <Input defaultValue={createdUserMail} hidden/>
                  </Form.Item>
                </Col>
                <Col  xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item name={'grnDate'} label={'GRN Date'} initialValue={dayjs()} rules={[{required: false,message: 'Date is required'}]}>
                    <DatePicker showToday format="YYYY-MM-DD" style={{ width: '100%' }}/>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item label="GRN No" name={'grnNumber'} rules={[{ required: false, message: 'GRN is required' }]}>
                    <Input placeholder="Enter GRN No" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item label="PO No" name={'poNumber'} rules={[{ required: false, message: 'PO is required' }]}>
                    <Input placeholder="Enter PO No" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item label="Style No" name={'styleNo'} rules={[{ required: true, message: 'Please input Style No' }]}>
                    <Input placeholder="Enter Style No" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item label="Item No" name={'itemNo'} rules={[{ required: true, message: 'Please input Item No' }]}>
                    <Input placeholder="Enter Item No" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item
                    label="Item Description"
                    name={'itemDescription'}
                    rules={[{ required: true, message: 'Please input Item Description' }]}
                  >
                    <Input placeholder="Enter Item Description" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item
                    label="Supplier"
                    name={'supplierId'}
                    rules={[{ required: true, message: 'Please input Supplier' }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="Select Supplier"
                      onChange={onSupplierChange}
                    >
                      {supplier.map((item) => (
                        <Option key={item.supplierId} value={item.supplierId} name={item.supplierName}>{item.supplierName} - {item.supplierCode}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Form.Item hidden name={'supplierName'}></Form.Item>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item
                    label="Invoice No"
                    name={'invoiceNo'}
                    rules={[{ required: false, message: 'Please input Invoice No' }]}
                  >
                    <Input placeholder="Enter Invoice No" />
                  </Form.Item>
                </Col>
                <Col  xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item
                    label="Approver Mail(Marketing)"
                    name={'approverId'}
                    rules={[{ required: true, message: 'Approver is required' }]}
                  >
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      placeholder="Select Approver"
                      onChange={onUserChange}
                    >
                      {employeeData.map((item) => (
                        <Option key={item.approvedId} value={item.approvedId} name={item.approvedUserName} mail={item.emailId}>
                          {item.emailId}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col  xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item label="Approver " name={'approverName'}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Form.Item name={'approverMail'} hidden></Form.Item>
                <Col xs={24} sm={12} md={6} lg={6} xl={4}>
                  <Form.Item
                    label="Remarks"
                    name={'remarks'}
                    rules={[{ required: false, message: 'Please input Remarks' }]}
                  >
                    <TextArea placeholder="Enter Remarks" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={15}>
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
              </Row>
            </>
          ) : (
            <>
              <Row gutter={24}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item
                    label="Buyer"
                    name={'buyerId'}
                    rules={[{ required: true, message: 'Buyer is required' }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="Select Buyer"
                      onChange={onBuyerChange}
                      allowClear
                    >
                      {buyerData.map((item) => (
                        <Option key={item.buyerName} value={item.buyerName}>{item.buyerName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item
                    label="Buyer Code"
                    name={'buyerCode'}
                    rules={[{ required: false, message: 'Buyer Code is required' }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="Select Buyer"
                      onChange={onBuyerCodeChange}
                    >
                      {buyerCodeData.map((item) => (
                        <Option key={item.buyerId} value={item.buyerCode}>{item.buyerCode}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Form.Item hidden name={'buyerName'}></Form.Item>
                <Form.Item hidden name={'trimSwatchId'}></Form.Item>
                <Form.Item hidden name={'trimSwatchNumber'}></Form.Item>

                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item name={'createdUser'} initialValue={createdUser} label={'Created By'}>
                    <Input defaultValue={createdUser} disabled/>
                  </Form.Item>
                  <Form.Item name={'createdUserMail'} initialValue={createdUserMail} hidden>
                    <Input defaultValue={createdUserMail} hidden/>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item
                    label="Transaction No"
                    name={'transactionNo'}
                    rules={[{ required: true, message: 'Transaction No is required' }]}
                  >
                    <Input placeholder='Enter Transaction No'/>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item
                    name={'transactionDate'}
                    label={'Transaction Date'}
                    initialValue={dayjs()}
                    rules={[{ required: false, message: 'Date is required' }]}>
                    <DatePicker showToday format="YYYY-MM-DD" style={{ width: '100%' }}/>
                  </Form.Item>
                </Col>
                <Form.Item hidden name={'trimSwatchId'}></Form.Item>
                <Form.Item hidden name={'trimSwatchNumber'}></Form.Item>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item
                    label="Remarks"
                    name={'remarks'}
                    rules={[{ required: false, message: 'Please input Remarks' }]}
                  >
                    <TextArea placeholder="Enter Remarks" />
                  </Form.Item>
                </Col>
                <div style={{marginLeft:'14px'}}>
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
                </div>
              </Row>
              <Card title={"Material Details"} style={{overflow:'auto'}}>
                <Form.List name="items" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', marginRight: '20px' }}>
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField },index) => (
                         <React.Fragment key={key}>
                          {index > 0 && <Divider />}
                        {/* <Row key={key} gutter={24} align="middle"> */}
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              {...restField}
                              label="Item No"
                              name={[name, 'itemNo']}
                              fieldKey={[fieldKey, 'itemNo']}
                              rules={[{ required: true, message: 'Please input Item No' }]}
                            >
                              <Select
                              allowClear
                                loading={isLoading}
                                showSearch
                                optionFilterProp='children'
                                placeholder='Select ItemCode'
                                value={form.getFieldValue([name, 'itemNo'])}
                                onChange={(value) => handleItemNoChange(value, name)}
                              >
                                {itemCodeData?.map((item, index) => (
                                  <Option key={`${item.itemCode}-${index}`} value={item.itemCode}>
                                    {item.itemCode}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              {...restField}
                              label="Item Description"
                              name={[name, 'itemDescription']}
                              fieldKey={[fieldKey, 'itemDescription']}
                              rules={[{ required: true, message: 'Please input Item Description' }]}
                            >
                              <Select
                              allowClear
                                loading={isLoading}
                                showSearch
                                optionFilterProp='children'
                                placeholder='Select Item Description'
                                value={form.getFieldValue([name, 'itemDescription'])}
                                onChange={(value) => handleItemDescriptionChange(value, name)}
                              >
                                {itemDesc?.map((item, index) => (
                                  <Option key={`${item.itemDesc}-${index}`} value={item.itemDesc}>
                                    {item.itemDesc}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              {...restField}
                              label="PO No"
                              name={[name, 'poNumber']}
                              fieldKey={[fieldKey, 'poNumber']}
                              rules={[{ required: false, message: 'PO is required' }]}
                            >
                              <Select
                              allowClear
                                loading={isLoading}
                                showSearch
                                optionFilterProp='children'
                                placeholder='Select PO'
                                value={form.getFieldValue([name, 'poNumber'])}
                                onChange={(value) => handlePONumberChange(value, name)}
                              >
                                {poData?.map((item, index) => (
                                  <Option key={`${item.poNo}-${index}`} value={item.poNo}>
                                    {item.poNo}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              {...restField}
                              label="GRN No"
                              name={[name, 'grnNumber']}
                              fieldKey={[fieldKey, 'grnNumber']}
                              rules={[{ required: false, message: 'GRN is required' }]}
                            >
                              <Select
                              allowClear
                                loading={isLoading}
                                showSearch
                                optionFilterProp='children'
                                placeholder='Select GRN'
                                value={form.getFieldValue([name, 'grnNumber'])}
                                onChange={(value) => handleGRNNumberChange(value, name)}
                              >
                                {poData?.map((item, index) => (
                                  <Option key={`${item.grnNo}-${index}`} value={item.grnNo}>
                                    {item.grnNo}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              name={'grnDate'}
                              label={'GRN Date'}
                              initialValue={dayjs()}
                              rules={[
                                {
                                  required: false,
                                  message: 'Date is required',
                                },
                              ]}
                            >
                              <DatePicker showToday format="YYYY-MM-DD" style={{ width: '100%' }}/>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              {...restField}
                              label="Material No"
                              name={[name, 'materialNo']}
                              fieldKey={[fieldKey, 'materialNo']}
                              rules={[{ required: true, message: 'Please input Material No' }]}
                            >
                              <Input placeholder="Enter Material No" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              {...restField}
                              label="Material Description"
                              name={[name, 'materialDescription']}
                              fieldKey={[fieldKey, 'materialDescription']}
                              rules={[{ required: true, message: 'Please input Material Description' }]}
                            >
                              <Input placeholder="Enter Material Description" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              label="Supplier"
                              name={'supplier'}
                              rules={[{ required: true, message: 'Please input Supplier' }]}
                            >
                              <Select
                              allowClear
                                loading={isLoading}
                                showSearch
                                optionFilterProp='children'
                                placeholder='Select Supplier'
                                value={form.getFieldValue([name, 'supplier'])}
                                onChange={(value) => handleSupplierChange(value, name)}
                              >
                                {poData?.map((item, index) => (
                                  <Option key={`${item.supplierName}-${index}`} value={item.supplierName}>
                                    {item.supplierName}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          {/* <Form.Item style={{ marginRight: 16 }} hidden name={'supplierName'}></Form.Item> */}
                          <Col
                            xs={24} sm={12} md={8} lg={6} xl={6}
                          >
                            <Form.Item style={{ marginRight: 16 }}
                              label="Invoice No"
                              name={'invoiceNo'}
                              rules={[{ required: false, message: 'Please input Invoice No' }]}
                            >
                              <Select
                              allowClear
                                loading={isLoading}
                                showSearch
                                optionFilterProp='children'
                                placeholder='Select InvoiceNo'
                                value={form.getFieldValue([name, 'invoiceNo'])}
                                onChange={(value) => handleInvoiceChange(value, name)}
                              >
                                {poData?.map((item, index) => (
                                  <Option key={`${item.invoiceNo}-${index}`} value={item.invoiceNo}>
                                    {item.invoiceNo}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col  xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }}
                              label="Approver Mail(Marketing)"
                              name={'approverId'}
                              rules={[{ required: true, message: 'Approver is required' }]}
                            >
                              <Select
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Select Approver"
                                onChange={onUserChange}
                              >
                                {employeeData.map((item) => (
                                  <Option key={item.approvedId} value={item.approvedId} name={item.approvedUserName} mail={item.emailId}>
                                    {item.emailId}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col  xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item style={{ marginRight: 16 }} label="Approver " name={'approverName'}>
                              <Input disabled />
                            </Form.Item>
                          </Col>
                          <Form.Item style={{ marginRight: 16 }} name={'approverMail'} hidden></Form.Item>
                          {fields.length > 1 ? (
                            <Col xs={4} sm={4} md={4} lg={4} xl={6}>
                              <Button onClick={() => remove(name)} icon={<MinusCircleOutlined />} />
                            </Col>
                          ) : null}
                        {/* </Row> */}
                        </React.Fragment>
                      ))}
                      {/* <Divider type='horizontal'/> */}
                      <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            disabled={fields.length >= 10}
                            className='animated-button'
                          >
                            + Add Item
                          </Button>
                        </Form.Item>
                      </Col>
                    </>
                    </div>
                  )}
                </Form.List>
              </Card>
            </>
          )}

          <Row>
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: '9px' }}>
              <Button htmlType="submit" className='animated-button'>
                Submit
              </Button>
              <Button
                danger
                htmlType="button"
                onClick={onReset}
                className='animated-button'
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}

export default TrimSwatchUpload;