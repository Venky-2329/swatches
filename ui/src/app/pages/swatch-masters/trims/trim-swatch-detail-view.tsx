import { Button, Card, Col, Descriptions, Divider, Form, Image, Modal, Popconfirm, Row, message } from "antd"
import DescriptionsItem from "antd/es/descriptions/Item"
import TextArea from "antd/es/input/TextArea"
import { EmailModel, TrimSwatchStatus } from "libs/shared-models"
import { EmailService, TrimSwatchService } from "libs/shared-services"
import moment from "moment"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import img from '../../../../../../upload-files/pexels-orlando-s-18290475-101bf.jpg'

export const TrimSwatchDetailView = () => {
    
    const service = new TrimSwatchService()
    const mailService = new EmailService()
    const { trimSwatchId } = useParams<any>();
    const [data , setData] = useState<any[]>([]);
    const navigate = useNavigate();
    const [modal , setModal] = useState<boolean>(false);
    const [formData , setFormData] = useState({})
    const [form] = Form.useForm();

    useEffect(() => {
        console.log(trimSwatchId,'kkkkkkkkkkkkkkkkkkkkkkk')
        getTrimDetails();
    },[trimSwatchId])

    const getTrimDetails =() => {
        const req = new TrimSwatchStatus(Number(trimSwatchId),undefined,undefined)
        service.getDataById(req).then((res) => {
            if(res.status){
                setData(res.data)
            }
        });
    };


    const TrimAccepted = (value)=>{
        console.log(value,',,,,,,,,,,,,,,,,,,,,')
        const req = new TrimSwatchStatus(value?.trimSwatchId,value?.trimSwatchId)
        service.updateApprovedStatus(req).then((res)=>{
            if(res.status){
                message.success(res.internalMessage,2)
                navigate('/trims-swatch-approval',{ state: { tab: 'APPROVED' } })
                sendMailForApprovalUser()
            }else{
                message.error(res.internalMessage,2)
            }
        })
      }

      const handelReject = (value)=>{
        setFormData(value?.trimSwatchId)
        setModal(true)
      }
    
      const TrimRejected =(value)=>{
        console.log(value,'.......................')
        const req = new TrimSwatchStatus(value,undefined,form.getFieldValue('rejectionReason'))
        service.updateRejectedStatus(req).then((res)=>{
            if(res.status){
                message.success(res.internalMessage,2)
                navigate('/trims-swatch-approval',{ state: { tab: 'APPROVED' } })
                setModal(false)
                onReset()
            }else{
                message.error(res.internalMessage,2)
            }
        })
      }
    
      const onReset = () => {
        form.resetFields();
      };

      let mailerSent = false;
      async function sendMailForApprovalUser() {
          const swatchDetails = new EmailModel();
          swatchDetails.swatchNo = data[0]?.trim_swatch_number
          swatchDetails.to = 'usplaystore761@gmail.com'
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
            <p>Trim Swatch No: ${data[0]?.trim_swatch_number}</p>
            <p>Buyer: ${data[0]?.buyerName}</p>
            <p>Supplier: ${data[0]?.supplierName}</p>
            <p>Style No: ${data[0]?.styleNo}</p>
            <p>Item No: ${data[0]?.itemNo}</p>
            <p>Please click the link below for details:</p>
  
            <a
              href="http://localhost:4200/#/trims-swatch-detail-view/${data[0]?.trimSwatchId}"
              style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
              "
              >View Details of ${data[0]?.trim_swatch_number}</a
            >
  
          </body>
        </html>
        `
          swatchDetails.subject = "Trim Swatch : " + data[0]?.trim_swatch_number
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
  
    
      const handleFormSubmit = () => {
        TrimRejected(formData);
      };

      const onModalCancel = () => {
        onReset()
        setModal(false);
      };
    
      return (
        <div>
          <Card
            title={<span>Swatch No: {data[0]?.trimSwatchNo}</span>}
            headStyle={{ backgroundColor: '#25529a', color: 'white' }}
            extra={
              <span style={{ color: 'white' }}>
                <Button
                  className="panel_button"
                  onClick={() => {
                    navigate('/trims-swatch-approval');
                  }}
                >
                  BACK
                </Button>
              </span>
            }
          >
            <Row gutter={16}>
            <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 5 }}
                lg={{ span: 6 }}
                xl={{ span: 14 }}
              >
            <Card style={{height:'400px', marginTop:''}}>
              <Descriptions size="default" column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} >
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Buyer</span>}><span style={{fontSize:'16px'}}>{data[0]?.buyerName}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Supplier</span> }><span style={{fontSize:'16px'}}>{data[0]?.supplier_name}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>PO No</span> }><span style={{fontSize:'16px'}}>{data[0]?.po_number}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Style No</span>}><span style={{fontSize:'16px'}}>{data[0]?.style_no}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Item No</span>}><span style={{fontSize:'16px'}}>{data[0]?.item_no}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Item Descrpition</span> }><span style={{fontSize:'16px'}}>{data[0]?.item_description}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Invoice No</span> }><span style={{fontSize:'16px'}}>{data[0]?.invoice_no}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Merchant</span> }><span style={{fontSize:'16px'}}>{data[0]?.merchant}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>GRN No(Kg)</span> }><span style={{fontSize:'16px'}}>{data[0]?.grn_number}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>GRN Date</span>}><span style={{fontSize:'16px'}}>{moment(data[0]?.grnDate).format('YYYY-MM-DD')}</span></DescriptionsItem>
              </Descriptions>
            </Card>
            </Col>
            <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 5 }}
            lg={{ span: 6 }}
            xl={{ span: 10 }}
            >
            <Card style={{ height: '331px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                src={img}
                alt="Preview"
                height={'300px'}
                width={'500px'}
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  marginRight: '100px',
                }}
              />
            </Card>
          <Divider type='horizontal'/>
            <div style={{ textAlign: 'center' }}>
                <Popconfirm
                  title="Are you sure to accept?"
                  onConfirm={() => TrimAccepted(data[0])}
                  okText="Yes"
                  cancelText="No"
                >
                <Button  style={{backgroundColor:'green', color:'white'}}>APPROVE</Button>
                </Popconfirm>
                <Divider type='vertical'/>
                <Button type='primary' danger onClick={() => handelReject(data[0])}>REJECT</Button>
            </div>
            </Col>
            </Row>
          </Card>
          <Modal
            visible={modal}
            onCancel={onModalCancel}
            footer={null}
            style={{ maxWidth: '90%' }}
            destroyOnClose
            >
              <Card
                title={'Reject'}
                size='small'
                headStyle={{ backgroundColor: '#25529a', color: 'white' }}
                >
                <Form form={form} layout='vertical' 
                onFinish={handleFormSubmit}
                >
                    <Row gutter={16}>
                    <Col xl={12} lg={12} xs={10}>
                        <Form.Item name='rejectionReason' label='Reason' rules={[{ required: true, message: 'Reason is required' }]}>
                        <TextArea rows={2} placeholder='Enter Reason' />
                        </Form.Item>
                    </Col>
                    </Row>
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
            </Modal>
        </div>
      );
};

export default TrimSwatchDetailView;