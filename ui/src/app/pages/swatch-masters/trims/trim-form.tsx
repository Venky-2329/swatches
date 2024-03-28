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
} from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import { SyncOutlined } from '@ant-design/icons'
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
  const createUser = users.userName;
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
    setFileList([]);
    // Additional logic for removing file
  };

  const onUserChange =(value,option)=>{
    console.log(option?.name,';;;;;;;;;;;;;;;;;')
    form.setFieldsValue({approverMail: option?.name})
}

  const handleBeforeUpload = async (file) => {
    if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
      notification.info({ message: 'Only png, jpeg, jpg files are allowed!' });
      return true;
    }

    try {
      const compressedImage = await compressImage(file);

      if (fileList.length === 1) {
        notification.info({
          message: 'You Cannot Upload More Than One File At A Time',
        });
        return true;
      } else {
        setFileList([...fileList, compressedImage]);
        return false;
      }
    } catch (error) {
      return true; // Returning true to prevent uploading if an error occurs
    }
  };

  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.5, // Adjust the maximum size as needed
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
    multiple: false,
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

  //   const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
  //     setFileList(newFileList);
  //   };

  function createUpload(values) {
    if (fileList.length > 0) {
      console.log(values,'...................')
      mainService.createTrimSwatch(values).then((res) => {
        if (res.status) {
          if (fileList.length > 0) {
            const formData = new FormData();
            fileList.forEach((file: any) => {
              formData.append('file', file);
            });
            formData.append('id', `${res.data.sampleId}`);
            mainService.photoUpload(formData).then((fileres) => {
              if (res.status) {
                form.setFieldsValue({trimSwatchNumber: res?.data?.trimSwatchNumber})
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

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  function gotoGrid() {
    navigate('/trims-swatch-view');
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    } else {
      setUploading(false);
    }
  };

  let mailerSent = false;
    async function sendMailForApprovalUser() {
        const swatchDetails = new EmailModel();
        swatchDetails.swatchNo = form.getFieldValue('trimSwatchNumber');
        swatchDetails.to = 'kushal.siddegowda@shahi.co.in';
        // swatchDetails.to = form.getFieldValue('approverMail')
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
          <p>Supplier: ${form.getFieldValue('supplier_name')}</p>
          <p>Style No: ${form.getFieldValue('style_no')}</p>
          <p>Item No: ${form.getFieldValue('item_no')}</p>

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
            message.success("Mail also sent successfully")
        }
    }
  return (
    <>
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
                initialValue={moment()}
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
                >
                  {buyer.map((item) => {
                    return (
                      <Option value={item.buyerId}>{item.buyerName}</Option>
                    );
                  })}
                </Select>
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
                label="Supplier"
                name={'supplierId'}
                rules={[{ required: true, message: 'Please input Supplier' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Select Supplier"
                >
                  {supplier.map((item) => {
                    return (
                      <Option value={item.supplierId}>{item.supplierName}</Option>
                    );
                  })}
                </Select>
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
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
            >
              <Form.Item
                label="Merchant"
                name={'merchant'}
                rules={[{ required: false, message: 'Merchant is required' }]}
              >
                <Input placeholder="Enter Merchant" />
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
                label="Checked By"
                name={'checkedBy'}
                rules={[{ required: true, message: 'Checked by is required' }]}
              >
                <Input placeholder="Enter Checked By" />
              </Form.Item>
            </Col>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item
                label="Approver"
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
                      <Option key={item.approvedId} value={item.approvedId} name={item.emailId}>
                        {item.approvedUserName}
                        </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} xl={{ span: 5 }}>
      <Form.Item label="Approver Mail" name={'approverMail'}>
        <Input disabled />
      </Form.Item>
    </Col>
          </Row>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 5 }}
            >
              <Form.Item label={'Trim Image'} required={true}>
                <Upload
                  {...uploadFieldProps}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={onPreview}
                  style={{ width: '200px', height: '200px' }}
                  accept=".png,.jpeg,.PNG,.jpg,.JPG"
                  onChange={handleChange}
                >
      {uploading ? <SyncOutlined spin /> : (fileList.length < 1 && '+ Upload')}
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
