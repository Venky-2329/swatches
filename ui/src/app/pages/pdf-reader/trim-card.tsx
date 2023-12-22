import { Card, Col, Descriptions, Row, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib';
import { useState } from 'react';
import { Document, pdfjs } from 'react-pdf';
import { PdfDataExtractor } from './extract-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
        const trimPdfData = await PdfDataExtractor(pdf)
        setPdfData(trimPdfData)
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
            extractTextFromPdf(file)
            return false;
        },
        fileList,
        showUploadList: false,
    };

    const extractTextFromPdf = async (pdfFile) => {
        const pdfData = await pdfFile.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
        let text = '';
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        text += textContent.items.map((item: any) => item.str).join(' ');
        let title = 'Production'
        extractPdfData(pdf,textContent)
        updateResultProps(title)
    };

    console.log(pdfData)
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
        </Row><br></br>
        {
          pdfData !=undefined ? <>
                  <Descriptions title="Trim Card Info">
          <Descriptions.Item label="Style#">{pdfData?.style}</Descriptions.Item>
          <Descriptions.Item label="Season">{pdfData?.season}</Descriptions.Item>
          {/* <Descriptions.Item label="Code">{pdfData?.code}</Descriptions.Item>
          <Descriptions.Item label="Product">{pdfData?.product}</Descriptions.Item>
          <Descriptions.Item label="Supplier Quote">{pdfData?.supplierQuote}</Descriptions.Item>
          <Descriptions.Item label="Supplier Code">{pdfData?.supplierCode}</Descriptions.Item>
          <Descriptions.Item label="UOM">{pdfData?.uom}</Descriptions.Item>
          <Descriptions.Item label="Placement">{pdfData?.placement}</Descriptions.Item>
          <Descriptions.Item label="Contractor Supplied">{pdfData?.contractorSupplied}</Descriptions.Item>
          <Descriptions.Item label="BRN-Carhartt Brown(Color)">{pdfData?.brnBrownColor}</Descriptions.Item>
          <Descriptions.Item label="BRN- Carhartt Brown(Qty By Color)">{pdfData?.brnBrownQtyByColor}</Descriptions.Item>
          <Descriptions.Item label="BLK- Black(Color)">{pdfData?.blkBlackColor}</Descriptions.Item>
          <Descriptions.Item label="BLK- Black(Qty By Color)">{pdfData?.blkBlackQtyByColor}</Descriptions.Item> */}
        </Descriptions>
          </> : ''
        }

      </Card>
    </>
  );
}
