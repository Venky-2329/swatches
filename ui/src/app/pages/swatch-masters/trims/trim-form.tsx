import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Upload,
  message,
  notification,
  Spin,
  Image,
} from 'antd';
import { useEffect, useState } from 'react';
import { SyncOutlined } from '@ant-design/icons'
import type {  UploadFile, UploadProps } from 'antd';
import {
  ApprovalUserService,
  BuyerService,
  EmailService,
  SupplierService,
  TrimSwatchService,
  createSample,
  uploadPhoto,
} from 'libs/shared-services';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { EmailModel } from 'libs/shared-models';
import dayjs from 'dayjs'
import TextArea from 'antd/es/input/TextArea';

export default function TrimSwatchUpload() {
  const {Option} = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);
  const [buyer, setBuyer] = useState([]);
  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const users: any = JSON.parse(localStorage.getItem('auth'));
  const createdUser = users.userName;
  const createdUserMail = users.userMail;
  const [selectedType, setSelectedType] = useState('Garment');
  const typesWithCommonFields = ['Garment', 'Trim'];
  const service = new BuyerService();
  const service2 = new SupplierService();
  const mainService = new TrimSwatchService();
  const [uploading, setUploading] = useState(false);
  const mailService = new EmailService()
  const employeeService = new ApprovalUserService()
  const [ employeeData, setEmployeeData ] = useState<any[]>([])
  const [ resData, setResData ] = useState<any[]>([])
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);






  useEffect(() => {
    getBuyers();
    getSupplier()
    getEmployeeData() 
  }, []);

  function getBuyers() {
    service.getAllBuyers().then((res) => {
      if (res.data) {
        setBuyer(res.data);
      }
    });
  }

  function getSupplier() {
    service2.getAllSuppliers().then((res) => {
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

  const getEmployeeData = ()=>{
    employeeService.getAllApprovalUser().then((res)=>{
      if(res.status){
        setEmployeeData(res.data)
      }
    })
  }

  const handleRemove = (file) => {
    // setFileList([]);
    console.log(file,'-----------fileId')
    const updatedFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(updatedFileList);
  };

  const onUserChange =(value,option)=>{
    console.log(option?.name,';;;;;;;;;;;;;;;;;')
    form.setFieldsValue({approverName: option?.name})
    form.setFieldsValue({approverMail : option?.mail})
}

  const handleBeforeUpload = async (file) => {
    console.log(file,'-------------------------')
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
        setFileList([...fileList, compressedImage]);
        setUploading(false)

        return false;
      }
    } catch (error) {
      return true; // Returning true to prevent uploading if an error occurs
    }
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
  console.log(uploadFieldProps,'kkkkkkkkkkkkkkk')


  function createUpload(values) {
    if (fileList.length > 0) {
      console.log(values,'...................')
      mainService.createTrimSwatch(values).then((res) => {
        console.log(res.data)
        if (res.status) {
          if (fileList.length > 0) {
            const formData = new FormData();
            fileList.forEach((file: any) => {
              formData.append('file', file);
            });
            formData.append('trimSwatchId', `${res.data.trimSwatchId}`);
            mainService.photoUpload(formData).then((fileres) => {
              if (res.status) {
                form.setFieldsValue({trimSwatchNumber: res?.data?.trimSwatchNumber})
                form.setFieldsValue({trimSwatchId: res?.data?.trimSwatchId})
                setResData(res.data)
                res.data.filePath = fileres.data;
                sendMailForApprovalUser()
                message.success(res.internalMessage,2)
                onReset();
                gotoGrid();
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



  const getBase64 = (file: UploadFile ): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj as Blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  function gotoGrid() {
    navigate('/trims-swatch-approval');
  }

  // const handleChange = (info) => {
  //   console.log(info.file.status)
  //   if (info.file.status === 'uploading') {
  //     setUploading(true);
  //   } else {
  //     setUploading(false);
  //   }
  // };

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
          href="http://localhost:4200/#/trims-swatch-detail-view/${form.getFieldValue('trimSwatchId')}"
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
        console.log(res)
        if (res.status == 201) {
            if (res.data.status) {
                message.success("Mail sent successfully")
                mailerSent = true;
            } else {
                message.success("Mail sent successfully")
            }
        } else {
            message.success("Notification Mail Sent to Approval User")
        }
    }

    const onBuyerChange=(value,option)=>{
      form.setFieldsValue({buyerName:option?.name})
    }
    const onSupplierChange=(value,option)=>{
      form.setFieldsValue({supplierName:option?.name})
    }
  return (
    <>
    {/* Loading overlay */}
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
        title="Trim Swatch"
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        extra={
          <span>
            <Button  onClick={gotoGrid}>
              View
            </Button>
          </span>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="GRN Date"
                name={'grnDate'}
                initialValue={dayjs()}
                rules={[
                  {
                    required: false,
                    message: 'GRN Date is required',
                  },
                ]}
              >
                <DatePicker format={'YYYY-MM-DD'} />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="GRN No"
                name={'grnNumber'}
                rules={[{ required: true, message: 'GRN is required' }]}
              >
                <Input placeholder="Enter GRN No" />
              </Form.Item>
            </Col>
            <Form.Item hidden name={'trimSwatchId'}></Form.Item>
            <Form.Item hidden name={'trimSwatchNumber'}></Form.Item>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Buyer"
                name={'buyerId'}
                rules={[
                  {
                    required: true,
                    message: 'Buyer is required',
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Select Buyer"
                  onChange={onBuyerChange}
                >
                  {buyer.map((item) => {
                    return (
                      <Option value={item.buyerId} name={item.buyerName}>{item.buyerName}</Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Form.Item hidden name={'buyerName'}></Form.Item>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
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
                  {supplier.map((item) => {
                    return (
                      <Option value={item.supplierId} name={item.supplierName} >{item.supplierName}</Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Form.Item hidden name={'supplierName'}></Form.Item>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="PO No"
                name={'poNumber'}
                rules={[{ required: false, message: 'PO is required' }]}
              >
                <Input placeholder="Enter PO No" />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Style No"
                name={'styleNo'}
                rules={[{ required: true, message: 'Please input Style No' }]}
              >
                <Input placeholder="Enter Style No" />
              </Form.Item>
            </Col>
            <Form.Item hidden name={'styleNo'}></Form.Item>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Item No"
                name={'itemNo'}
                rules={[{ required: true, message: 'Please input Item No' }]}
              >
                <Input placeholder="Enter Item No" />
              </Form.Item>
            </Col>
            <Form.Item hidden name={'itemNo'}></Form.Item>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Item Description"
                name={'itemDescription'}
                rules={[
                  {
                    required: true,
                    message: 'Please input Item Description',
                  },
                ]}
              >
                <Input placeholder="Enter Item Description" />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Invoice No"
                name={'invoiceNo'}
                rules={[{ required: true, message: 'Please input Invoice No' }]}
              >
                <Input placeholder="Enter Invoice No" />
              </Form.Item>
            </Col>

            {/*      <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 6 }}
                      lg={{ span: 6 }}
                      xl={{ span: 4 }}
                    >
                      <Form.Item
                        label="Mill/Vendor"
                        name={'mill'}
                        rules={[{ required: false, message: 'Please input Mill' }]}
                      >
                        <Input placeholder="Enter Mill" />
                      </Form.Item>
                    </Col> */}
           <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name={'createdUser'} initialValue={createdUser} label={'Created By'}>
                  <Input defaultValue={createdUser} disabled/>
                </Form.Item>
                <Form.Item name={'createdUserMail'} initialValue={createdUserMail} hidden>
                  <Input defaultValue={createdUserMail} hidden/>
                </Form.Item>
              </Col>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={6}
            >
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
                  {employeeData.map((item) => {
                    return (
                      <Option key={item.approvedId} value={item.approvedId} name={item.approvedUserName} mail= {item.emailId}>
                        {item.emailId}
                        </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} xl={{ span: 5 }}>
        <Form.Item label="Approver " name={'approverName'}>
          <Input disabled />
        </Form.Item>

        <Form.Item  name={'approverMail'} hidden>
        </Form.Item>
    </Col>
    <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Remarks"
                name={'remarks'}
                rules={[{ required: false, message: 'Please input Remarks' }]}
              >
                <TextArea placeholder="Enter Remarks" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 15 }}
            >
              <Form.Item label={'Trim Image'} required={true}>
                <Upload
                  {...uploadFieldProps}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  style={{ width: '200px', height: '200px' }}
                  accept=".png,.jpeg,.PNG,.jpg,.JPG"
                >
                  {uploading ? <SyncOutlined spin /> : (fileList.length < 3 && '+ Upload')}


                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <br></br>
          <Row gutter={24} style={{ alignContent: 'end' }}>
            <Col
              xs={{ span: 6 }}
              sm={{ span: 6 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 2 }}
            >
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            </Col>
            <Col
              xs={{ span: 6 }}
              sm={{ span: 6 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 1 }}
            >
              <Button onClick={onReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
