import { Card, Col, Descriptions, Row, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib';
import { useState } from 'react';
import { Document, pdfjs } from 'react-pdf';

class ResultPropsModel {
    status: any;
    title: any;
    subtitle: any;
    extra: any
}

export default function TrimCard() {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [resultProps, setResultProps] = useState<ResultPropsModel>();
    const [pdfData, setPdfData] = useState<any>()

    const updateResultProps = (title) => {
        const resultProps: ResultPropsModel = new ResultPropsModel()
        if (title == undefined) {
            resultProps.status = 'error'
            resultProps.title = 'Wrong document uploaded'
            resultProps.subtitle = 'Document doesnt match the criteria,please upload correct documet'
        } else {
            resultProps.status = 'success'
            resultProps.title = 'Document found  : ' + title
            resultProps.subtitle = 'Please check the values below'
        }
        setResultProps(resultProps)
    }

    async function extractPdfData(pdf: any, pdfText: any) {
        // const trimPdfData = await extractDataFromPoPdf(pdf)
        const trimPdfData = ''
        setPdfData(trimPdfData)
    }

    const uploadProps: UploadProps = {
        name: 'file',
        accept: '.pdf',
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            extractTextFromPdf(file)
            return false;
        },
        fileList,
        showUploadList: false
    };

    const extractTextFromPdf = async (pdfFile) => {
        const pdfData = await pdfFile.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
        let text = '';
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        text += textContent.items.map((item: any) => item.str).join(' ');
        let title = 'Trim Card'
        updateResultProps(title)
    };
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
        <Descriptions title="Trim Card Info">
          <Descriptions.Item label="Style#">106668</Descriptions.Item>
          <Descriptions.Item label="Season">2024 Fall</Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
}
