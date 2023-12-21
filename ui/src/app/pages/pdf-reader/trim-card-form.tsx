import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Row, Space, Typography, Upload, UploadFile, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RcFile } from 'antd/es/upload';
import { UploadProps } from 'antd/lib';
import { useState } from 'react';

export default function TrimCardForm() {
  const [form] = Form.useForm();
  const [filelist, setFilelist] = useState([]);
  const [fileList, setFileList] = useState<UploadFile[]>([])


  const uploadFieldProps: UploadProps = {
    multiple: false,
    onRemove: file => {
        setFileList([]);
      // uploadFileList([]);
    },
    beforeUpload: (file: any) => {
      if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG|xls|xlsx)$/)) {
        notification.info({message:"Only png, jpeg, jpg, xls, xlsx files are allowed!"});
        return true;
      }
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = data => {
        if (fileList.length === 1) {
            notification.info({message:"You Cannot Upload More Than One File At A Time"});
          return true;
        } else {
            setFileList([...fileList, file]);
          // uploadFileList([...filelist, file]);
          return false;
        }
      };

      // Add a default return value for cases where none of the conditions are met
      return false;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList: filelist
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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

  return (
    <>
      <Card title="CARHARTT TRIM CARD">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={3}>
              <Form.Item name={'date'} label="Date">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name={'poNumber'} label="PO#">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name={'quantity'} label="Quantity">
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name={'itemNO'} label="Item No">
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name={'factory'} label="Factory">
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name={'wash'} label="Wash">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 6 }}>
              <Form.Item name="fileUpload"
              >
                <Upload {...uploadFieldProps} listType="picture-card" onPreview={onPreview} onChange={onChange}>
                {fileList.length < 5 && '+ Upload'}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={3}>
              <Form.Item name={'preparedBy'} label="Prepared By">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name={'approvedBy'} label="Approved By">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name={'qaApproval'} label="QA Approval">
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name={'remarks'} label="Remarks">
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="Placements">
        <Form form={form} layout="vertical">
          <Form.List name="placements">
            {(fields, { add, remove }) => (
              <Card>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 8 }}
                  >
                    <Row gutter={24}>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="Code"
                          name={[field.name, 'code']}
                          fieldKey={[field.key, 'code']}
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter code',
                            },
                          ]}
                        >
                          <Input placeholder="Enter code" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="Product"
                          name={[field.name, 'product']}
                          fieldKey={[field.key, 'product']}
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter Product',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={6 }>
                        <Form.Item
                          label="Material Artwork Description"
                          name={[field.name, 'materialArtworkDescription']}
                          fieldKey={[field.key, 'materialArtworkDescription']}
                          rules={[
                            { required: true, message: 'Missing Material Artwork Description' },
                          ]}
                        >
                          <Input  />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          label="Supplier Quote"
                          name={[field.name, 'supplierQuote']}
                          fieldKey={[field.key, 'supplierQuote']}
                          rules={[
                            { required: true, message: 'Missing Supplier Quote' },
                          ]}
                        >
                            <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="UOM"
                          name={[field.name, 'uom']}
                          fieldKey={[field.key, 'uom']}
                          rules={[
                            {
                              required: true,
                              message: 'Enter UOM',
                            },
                          ]}
                        >
                          <Input placeholder="Enter Efforts" />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="Placement"
                          name={[field.name, 'placement']}
                          fieldKey={[field.key, 'placement']}
                          rules={[
                            {
                              required: true,
                              message: 'Enter a valid Placement',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="Contractor Supllied"
                          name={[field.name, 'contractorSupplied']}
                          fieldKey={[field.key, 'contractorSupplied']}
                          rules={[
                            {
                              required: true,
                              message: 'Enter a Contractor Supplied',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="BRN- Carhartt Brown(Color)"
                          name={[field.name, 'brnBrownColor']}
                          fieldKey={[field.key, 'brnBrownColor']}
                          rules={[
                            {
                              required: true,
                              message: 'Enter BRN- Carhartt Brown(Color)',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          {...field}
                          label="BRN-Carhartt Brown(Qty by Color)"
                          name={[field.name, 'brnBrownQtyByColor']}
                          fieldKey={[field.key, 'brnBrownQtyByColor']}
                          rules={[
                            {
                              required: true,
                              message: 'Enter BRN- Carhartt Brown(Qty by Color)',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="BLK- Black(Color)"
                          name={[field.name, 'blkBlackColor']}
                          fieldKey={[field.key, 'blkBlackColor']}
                          rules={[
                            {
                              required: true,
                              message: 'Enter BLK- Black(Color)',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="BLK- Black(Qty by Color)"
                          name={[field.name, 'blkBlackQtyByColor']}
                          fieldKey={[field.key, 'blkBlackQtyByColor']}
                          rules={[
                            {
                              required: true,
                              message: 'Enter BLK- Black(Qty by Color)',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Placements
                  </Button>
                </Form.Item>
              </Card>
            )}
          </Form.List>
        </Form>
      </Card>
    </>
  );
}
