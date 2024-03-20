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
  notification,
} from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import ImgCrop from 'antd-img-crop';
import {
  BuyerService,
  createSample,
  getBrandsData,
  getCategoryData,
  getLocationData,
  getSeasonData,
  uploadPhoto,
} from 'libs/shared-services';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export default function TrimSwatchUpload() {
  const Option = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);
  const [buyer, setBuyer] = useState([]);
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const users: any = JSON.parse(localStorage.getItem('auth'));
  const createUser = users.userName;
  const [selectedType, setSelectedType] = useState('Garment');
  const typesWithCommonFields = ['Garment', 'Trim'];
  const service = new BuyerService();

  useEffect(() => {
    getBuyers();
    getCategories();
    getSeason();
  }, []);

  function getBuyers() {
    service.getAllBuyers().then((res) => {
      if (res.data) {
        setBuyer(res.data);
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

  function getLocations() {
    getLocationData().then((res) => {
      if (res.data) {
        setLocation(res.data);
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

  function onFinish(values) {
    createSampleUpload(values);
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

  function createSampleUpload(values) {
    if (fileList.length > 0) {
      createSample(values).then((res) => {
        if (res.status) {
          if (fileList.length > 0) {
            const formData = new FormData();
            fileList.forEach((file: any) => {
              formData.append('file', file);
            });
            formData.append('id', `${res.data.sampleId}`);
            uploadPhoto(formData).then((fileres) => {
              if (res.status) {
                res.data.filePath = fileres.data;
                notification.success({
                  message: res.internalMessage,
                  placement: 'top',
                  duration: 1,
                });
                onReset();
                gotoGrid();
              } else {
                notification.error({
                  message: res.internalMessage,
                  placement: 'top',
                  duration: 1,
                });
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
    navigate('/sample-view');
  }
  return (
    <>
      <Card
        title="Trims Swatch"
        extra={
          <span>
            <Button type="primary" onClick={gotoGrid}>
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
                rules={[{ required: false, message: 'GRN is required' }]}
              >
                <Input placeholder="Enter GRN No" />
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
                >
                  {fileList.length < 5 && '+ Upload'}
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
