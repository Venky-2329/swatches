import {Card,Col,DatePicker,Descriptions,Upload,Input,Row,UploadProps,notification,Button,Space} from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import {CheckCircleOutlined, InboxOutlined,LoadingOutlined,MinusCircleOutlined,PlusOutlined} from '@ant-design/icons';
import { Form } from 'antd/lib';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { PdfDataExtractor } from './extract-pdf';
import TextArea from 'antd/es/input/TextArea';
import { TrimDetails, TrimPodfModel, TrimTypes } from 'libs/shared-models';
import { saveData, saveExcelData, uploadFiles } from 'libs/shared-services';
import * as XLSX from 'xlsx';
import AlertMessages from '../../common/notifications/notifications';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ResultPropsModel {
  status: any;
  title: any;
  subtitle: any;
  extra: any;
}

export default function TrimCard() {
  const [resultProps, setResultProps] = useState<ResultPropsModel>();
  const [pdfData, setPdfData] = useState<any>();
  const [form] = Form.useForm();
  const [filelist, setFilelist] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [blkFileList, setBlkFileList] = useState([]);
  const [brnFileList, setBrnFileList] = useState([]);
  const [uploadList, setUploadList] = useState([]);

  const excelUploadProps: UploadProps = {
    name: 'file',
    accept: '.xlsx',
    multiple: false,
    onRemove: (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setUploadList(newFileList);
    },
    beforeUpload: (file) => {
        setUploadList([...fileList, file]);
        return false;
    },
    fileList,
    showUploadList: true,
    listType: 'picture-card'
};

console.log(uploadList)

  const brnUploadFieldProps: UploadProps = {
    multiple: false,
    onRemove: (file) => {
      setBrnFileList((prevFileList) =>
        prevFileList.filter((f) => f.uid !== file.uid)
      );
    },
    beforeUpload: (file: any) => {
      if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
        notification.info({
          message: 'Only png, jpeg, jpg files are allowed!',
        });
        return false;
      }
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (data) => {
        setBrnFileList([...brnFileList, file]);
        return false;
      };
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList: brnFileList,
  };

  const blkUploadFieldProps: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      setBlkFileList((prevFileList) =>
        prevFileList.filter((f) => f.uid !== file.uid)
      );
    },
    beforeUpload: (file: any) => {
      if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG|xls|xlsx)$/)) {
        notification.info({
          message: 'Only png, jpeg, jpg, xls, xlsx files are allowed!',
        });
        return false;
      }
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (data) => {
        setBlkFileList([...blkFileList, file]);
        return false;
      };
      return false;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList: blkFileList,
  };

  const uploadFieldProps: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      setFilelist([]);
    },
    beforeUpload: (file: any) => {
      if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG|xls|xlsx)$/)) {
        notification.info({
          message: 'Only png, jpeg, jpg, xls, xlsx files are allowed!',
        });
        return true;
      }
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (data) => {
        if (filelist.length === 1) {
          notification.info({
            message: 'You Cannot Upload More Than One File At A Time',
          });
          return true;
        } else {
          setFilelist([...filelist, file]);
          return false;
        }
      };
      return false;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList: filelist,
  };

  const updateResultProps = (title) => {
    const resultProps: ResultPropsModel = new ResultPropsModel();
    if (title == undefined) {
      resultProps.status = 'error';
      resultProps.title = 'Wrong document uploaded';
      resultProps.subtitle =
        'Document doesnt match the criteria,please upload correct documet';
    } else {
      resultProps.status = 'success';
      resultProps.title = 'Document found  : ' + title;
      resultProps.subtitle = 'Please check the values below';
    }
    setResultProps(resultProps);
  };

  async function extractPdfData(pdf: any, pdfText: any) {
    const trimPdfData = await PdfDataExtractor(pdf);
    setPdfData(trimPdfData);
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf',
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      extractTextFromPdf(file);
      return false;
    },
    fileList,
    showUploadList: false,
  };

  const extractTextFromPdf = async (pdfFile) => {
    const pdfData = await pdfFile.arrayBuffer();
    console.log(pdfData)
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    let text = '';
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item: any) => item.str).join(' ');
    let title = 'Production';
    extractPdfData(pdf, textContent);
    updateResultProps(title);
  };
  function submit(values) {
    console.log(values);
    const req = new TrimPodfModel();
    req.date = values.date;
    req.factory = values.factory;
    req.poNumber = values.poNumber;
    req.quantity = values.quantity;
    req.itemNo = values.itemNO;
    req.wash = values.wash;
    req.preparedBy = values.preparedBy;
    req.approvedBy = values.approvedBy;
    req.qaApproval = values.qaApproval;
    req.remarks = values.remarks;
    req.pdfFileName = values.fileUpload.file.name;
    req.style = pdfData.style;
    req.season = pdfData.season;
    req.trimTypes = pdfData.trimTypes;
    if (!req.trimTypes) {
      req.trimTypes = [];
    }
    pdfData.trimTypes.forEach((v) => {
      if (values.placements.some((p) => p.code == v.trimDetails.code)) {
        const trimType = new TrimTypes();
        const trimDetails = new TrimDetails();
        const matchingPlacement = values.placements.find(
          (p) => p.code === v.trimDetails.code
        );
        if (matchingPlacement) {
          trimDetails.brnFileName = matchingPlacement.brnfFleUpload.file.name;
          trimDetails.blkFileName = matchingPlacement.blkfileUpload.file.name;
          console.log(trimDetails);
          trimType.trimDetails = trimDetails;
          console.log(trimType);
          req.trimTypes.push(trimType);
          console.log(req);
        }
      }
    });
    console.log(req);
    saveData(req).then((res) => {
      console.log(res);
      console.log(brnFileList);
      if (res.status) {
        if (brnFileList.length) {
          console.log(brnFileList);
          // Filter placements based on codes present in res.data.pdfChiltEntity
          const formData = new FormData();
          for (let i = 0; i < brnFileList.length; i++) {
            formData.append('file', brnFileList[i]);
          }
          console.log(formData);
          uploadFiles(formData).then((uploadRes) => {});
        }
        if (blkFileList.length) {
          const formData2 = new FormData();
          for (let i = 0; i < blkFileList.length; i++) {
            formData2.append('file', blkFileList[i]);
          }
          uploadFiles(formData2).then((uploadRes) => {});
        }
        if (filelist.length) {
          const formData3 = new FormData();
          filelist.forEach((file: any) => {
            formData3.append('file', file);
          });
          uploadFiles(formData3).then((uploadRes) => {});
        }
        notification.success({ message: res.internalMessage });
        onReset()
      }
    });
  }

  function onReset() {
    form.resetFields();
  }
  const imagesPath = 'https://172.20.50.169/'

  const handleUpload = async () => {
    console.log('ssssssssssssssss')
    AlertMessages.getCustomIconMessage("excelupload", "Excel is uploading", <LoadingOutlined style={{ color: '#22C55E' }} />)
    if (uploadList.length) {
        const formData = new FormData();
        formData.append('file', uploadList[0])
        console.log(formData)
        saveExcelData(formData).then((res) => {
            if (res.data.status === true) {
                AlertMessages.getCustomIconMessage("excelupload", "Excel Uploaded Sucessfuly", <CheckCircleOutlined style={{ color: '#22C55E' }} />, 2)

            } else {
                AlertMessages.getInfoMessage("excelupload", res.data.internalMessage)
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage("excelupload", "Unknown error occured")
        }).finally(() => {
            setFileList([])
        })
    }
}
 
  return (
    <>
      <Card>
        <Row gutter={24}>
          <Col span={24}>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Please upload only valid documents .
              </p>
            </Dragger>
          </Col>
        </Row>
        <Row>
        <Col>
           <Button onClick={handleUpload}>Upload</Button>
          </Col>
        </Row>
        <br></br>
        {pdfData != undefined ? (
          <>
            <Descriptions title="Trim Card Info">
              <Descriptions.Item label="Style#">
                {pdfData?.style}
              </Descriptions.Item>
              <Descriptions.Item label="Season">
                {pdfData?.season}
              </Descriptions.Item>
            </Descriptions>

            <br />
            <Form form={form} layout="vertical" onFinish={submit}>
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
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  xl={{ span: 3 }}
                >
                  <Form.Item name="fileUpload">
                    <Upload {...uploadFieldProps} listType="picture-card">
                      {filelist.length < 5 && '+ Upload'}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              {/* </Form> */}
              {/* <Form form={form} layout="vertical"> */}
              <Form.List name="placements">
                {(fields, { add, remove }) => (
                  <Card>
                    {fields.map((field, index) => (
                      <Space
                        key={field.key}
                        style={{ display: 'flex', marginBottom: 8 }}
                      >
                        <Row gutter={24}>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              label="Code"
                              name={[field.name, 'code']}
                              fieldKey={[field.key, 'code']}
                              rules={[
                                {
                                  required: false,
                                  message: 'Please Enter code',
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 8 }}
                            lg={{ span: 8 }}
                            xl={{ span: 8 }}
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, 'brnfFleUpload']}
                              fieldKey={[field.key, 'brnfFleUpload']}
                              label="BRN Photo"
                            >
                              <Upload
                                {...brnUploadFieldProps}
                                listType="picture-card"
                                fileList={
                                  Array.isArray(brnFileList[field.name])
                                    ? brnFileList[field.name]
                                    : []
                                }
                                key={brnFileList[field.name]}
                              >
                                {brnFileList.length < 5 && '+ Upload'}
                              </Upload>
                            </Form.Item>
                          </Col>
                          <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 8 }}
                            lg={{ span: 8 }}
                            xl={{ span: 8 }}
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, 'blkfileUpload']}
                              fieldKey={[field.key, 'blkfileUpload']}
                              label="BLK Photo"
                            >
                              <Upload
                                {...blkUploadFieldProps}
                                listType="picture-card"
                                fileList={
                                  Array.isArray(blkFileList[field.name])
                                    ? blkFileList[field.name]
                                    : []
                                }
                                key={blkFileList[field.name]}
                              >
                                {blkFileList.length < 5 && '+ Upload'}
                              </Upload>
                            </Form.Item>
                          </Col>
                        </Row>
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
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
              <br />
              <Row gutter={24} justify={'end'}>
                <Col span={2}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Col>
                <Col span={2}>
                  <Button onClick={onReset}>Reset</Button>
                </Col>
              </Row>
            </Form>
          </>
        ) : (
          ''
        )}
      </Card>
    </>
  );
}
