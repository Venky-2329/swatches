import {Button,Card,Col,Form,Input,Row,Select,Upload,message,notification} from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import {ApprovalUserService, BuyerService,EmailService,EmployeeService,FabricSwatchService,createSample,getBrandsData,getCategoryData,getLocationData,getSeasonData,uploadPhoto,} from 'libs/shared-services';
import imageCompression from 'browser-image-compression';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';
import { SyncOutlined } from '@ant-design/icons'
import { EmailModel } from 'libs/shared-models';
import dayjs from 'dayjs';
import AlertMessages from 'ui/src/app/common/notifications/notifications';

export default function FabricSwatchUpload() {
  const {Option} = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);
  const [buyerData, setBuyerData] = useState<any[]>([]);
  const [seasons, setSeasons] = useState([]);
  const users: any = JSON.parse(localStorage.getItem('auth'));
  const createdUser = users.userName;
  const createdUserMail = users.userMail
  const [selectedType, setSelectedType] = useState('Garment');
  const typesWithCommonFields = ['Garment', 'Trim'];
  const buyerService = new BuyerService();
  const service = new FabricSwatchService();
  const employeeService = new ApprovalUserService()
  const [ employeeData, setEmployeeData ] = useState<any[]>([])
  const [uploading, setUploading] = useState(false);
  const mailService = new EmailService()
  const [ resData, setResData ] = useState<any[]>([])



  useEffect(() => {
    getBrands();
    getCategories();
    getSeason();
    getBuyers();
    getEmployeeData()
  }, []);

  const getBuyers = () => {
    buyerService.getAllActiveBuyers().then((res) => {
      if (res.status) {
        setBuyerData(res.data);
      }
    });
  };

  function getBrands() {
    getBrandsData().then((res) => {
      if (res.data) {
        setBrands(res.data);
      }
    });
  }

  function getCategories() {
    getCategoryData().then((res) => {
      if (res.data) {
        setCategory(res.data);
      }
    });
  }

  function getSeason() {
    getSeasonData().then((res) => {
      if (res.data) {
        setSeasons(res.data);
      }
    });
  }

  function onReset() {
    form.resetFields();
    setFileList([]);
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

  const handleBeforeUpload = async (file) => {
    if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
      notification.info({ message: 'Only png, jpeg, jpg files are allowed!' });
      return true;
    }

    try {
      const compressedImage = await compressImage(file);

      if (fileList.length == 3) {
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

  const onFinish = (values) => {
    if (fileList.length > 0) {
      service.createFabricSwatch(values).then((res) => {
        if (res.status) {
          if (fileList.length > 0) {
            const formData = new FormData();
            fileList.forEach((file: any) => {
              formData.append('file', file);
            });
            formData.append('fabricSwatchId', `${res.data.fabricSwatchId}`);
            service.uploadPhoto(formData).then((fileres) => {
              if (res.status) {
                form.setFieldsValue({fabricSwatchNumber: res?.data?.fabricSwatchNumber})
                form.setFieldsValue({fabricSwatchId: res?.data?.fabricSwatchId})
                res.data.filePath = fileres.data;
                // sendMailForApprovalUser()
                message.success(res.internalMessage, 2);
                onReset();
                gotoGrid();
              } else {
                message.error(res.internalMessage, 2);
              }
            });
          }
        } else {
          message.info(res.internalMessage, 2);
        }
      });
    } else {
      return notification.info({ message: 'Please upload Swatch' });
    }
  };

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
    navigate('/fabric-swatch-approval');
  }

  const onUserChange =(value,option)=>{
         form.setFieldsValue({approverName: option?.name})
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    } else {
      setUploading(false);
    }
  };

  const onBuyerChange = (value, option)=>{
    form.setFieldsValue({buyerName: option?.name})
  }

  const onBrandChange = (value, option)=>{
    form.setFieldsValue({brandName: option?.name})
  }

    let mailerSent = false;
    async function sendMailForApprovalUser() {
        const swatchDetails = new EmailModel();
        swatchDetails.swatchNo = form.getFieldValue('fabricSwatchNumber')
        swatchDetails.to = 'playstore2636@gmail.com'
        // swatchDetails.to = form.getFieldValue('approverMail')
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
          <p>Please find the Fabric Swatch details below:</p>
          <p>Fabric Swatch No: ${form.getFieldValue('fabricSwatchNumber')}</p>
          <p>Buyer: ${form.getFieldValue('buyerName')}</p>
          <p>Brand: ${form.getFieldValue('brandName')}</p>
          <p>Style No: ${form.getFieldValue('styleNo')}</p>
          <p>Item No: ${form.getFieldValue('itemNo')}</p>
          <p>Please click the link below for details:</p>

          <a
            href="http://localhost:4200/#/fabric-swatch-detail-view/${form.getFieldValue('fabricSwatchId')}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            "
            >View Details of ${form.getFieldValue('fabricSwatchNumber')}</a
          >

        </body>
      </html>
      `
        swatchDetails.subject = "Fabric Swatch : " + form.getFieldValue('fabricSwatchNumber')
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
            title={<span style={{ color: "white" }}>Fabric Swatch</span>}
            extra={
              (
                  <Link to="/fabric-swatch-approval">
                      <span style={{ color: "white" }}>
                          <Button>View </Button>{" "}
                      </span>
                  </Link>
              )
          }
          headStyle={{ backgroundColor: '#25529a', color: 'white' }}
          >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Form.Item hidden name={'fabricSwatchId'}></Form.Item>
            <Form.Item hidden name={'fabricSwatchNumber'}></Form.Item>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item
                label="Buyer"
                name={'buyerId'}
                rules={[
                  {
                    required: false,
                    message: 'Buyer is required',
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Select Buyer"
                  onChange={onBuyerChange}
                  allowClear
                >
                  {buyerData.map((item) => {
                    return (
                      <Option key={item.buyerId} value={item.buyerId} name={item.buyerName}>
                        {item.buyerName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Form.Item hidden name={'buyerName'}></Form.Item>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item
                label="Brand"
                name={'brandId'}
                rules={[{ required: true, message: 'Please input Brand' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Select Brand"
                  onChange={onBrandChange}
                  allowClear
                >
                  {brands.map((item) => {
                    return (
                      <Option value={item.brandId} name={item.brandName}>{item.brandName}</Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Form.Item hidden name={'brandName'}><Input/></Form.Item>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
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
              xs={24} sm={12} md={8} lg={6} xl={4}
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
              xs={24} sm={12} md={8} lg={6} xl={4}
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
                <Input placeholder="Enter Item Description"/>
              </Form.Item>
            </Col>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item label="Category Type" name={'categoryType'}>
                <Select placeholder="Select Type" allowClear>
                  <Option value={'denim'}>Denim</Option>
                  <Option value={'woven'}>Woven</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item
                label="Category"
                name={'categoryId'}
                rules={[{ required: false, message: 'Please input Category' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Select Category"
                  allowClear
                >
                  {category.map((item) => {
                    return (
                      <Option value={item.categoryId}>
                        {item.categoryName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item
                label="Season"
                name={'seasonId'}
                rules={[{ required: false, message: 'Please input Season' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Select season"
                  allowClear
                >
                  {seasons.map((item) => {
                    return (
                      <Option value={item.seasonId}>{item.seasonName}</Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item
                label="Mill/Vendor"
                name={'mill'}
                rules={[{ required: false, message: 'Please input Mill' }]}
              >
                <Input placeholder="Enter Mill" />
              </Form.Item>
            </Col>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item
                label="Color"
                name={'color'}
                rules={[{ required: false, message: 'Color is required' }]}
              >
                <Input placeholder="Enter Color" />
              </Form.Item>
            </Col>
            <Col
              xs={24} sm={12} md={8} lg={6} xl={4}
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
              xs={24} sm={12} md={8} lg={6} xl={4}
            >
              <Form.Item
                label="GRN No"
                name={'grnNumber'}
                rules={[{ required: false, message: 'GRN is required' }]}
              >
                <Input placeholder="Enter GRN No" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item
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
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name={'createdUser'} initialValue={createdUser} label={'Created By'}>
                  <Input defaultValue={createdUser} disabled/>
                </Form.Item>
                <Form.Item name={'createdUserMail'} initialValue={createdUserMail} hidden>
                  <Input defaultValue={createdUser} hidden/>
                </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} xl={{ span: 5 }}>
              <Form.Item label="Approver Mail(Marketing)" name={'approverId'} rules={[{ required: true, message: 'Approver is required' }]}>
              <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  placeholder="Select Approver Mail"
                  onChange={onUserChange}
                >
                  {employeeData.map((item) => {
                    return (
                      <Option key={item.approvedId} value={item.approvedId} name={item.approvedUserName}>
                        {item.emailId}
                        </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item
                label="Approver"
                name={'approverName'}
                rules={[{ required: false, message: 'Approver is required' }]}
              >
                <Input disabled placeholder='Approver'/>
                {/* <Select
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
                </Select> */}
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 18 }} lg={{ span: 15 }} xl={{ span: 15 }}>
              <Form.Item label={'Fabric Image'} required={true}>
              <Upload
              {...uploadFieldProps}
              listType="picture-card"
              fileList={fileList}
              onPreview={onPreview}
              style={{ width: '200px', height: '200px' }}
              accept=".png,.jpeg,.PNG,.jpg,.JPG"
              onChange={handleChange}
            >
              {uploading ? <SyncOutlined spin /> : (fileList.length < 3 && '+ Upload')}
            </Upload>
              </Form.Item>
            </Col>
          </Row>
          <br></br>
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
      </Card>
    </>
  );
}
