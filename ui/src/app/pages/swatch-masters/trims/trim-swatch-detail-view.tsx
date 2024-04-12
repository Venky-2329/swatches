import { Button, Card, Col, Descriptions, Divider, Form, Image, Modal, Popconfirm, Row, message } from "antd"
import DescriptionsItem from "antd/es/descriptions/Item"
import TextArea from "antd/es/input/TextArea"
import { EmailModel, StatusDisplayEnum, TrimSwatchStatus } from "libs/shared-models"
import { EmailService, TrimSwatchService } from "libs/shared-services"
import moment from "moment"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import img from '../../../../../../upload-files/pexels-orlando-s-18290475-6988.jpg'
import TrimSwatchApproval from "./trim-approval"

export const TrimSwatchDetailView = () => {
    
    const service = new TrimSwatchService()
    const mailService = new EmailService()
    const { trimSwatchId } = useParams<any>();
    const [data , setData] = useState<any[]>([]);
    const navigate = useNavigate();
    const [modal , setModal] = useState<boolean>(false);
    const [formData , setFormData] = useState({})
    const [form] = Form.useForm();
    const createUser = JSON.parse(localStorage.getItem('auth'));
    const department = createUser.departmentId
    const userRole = createUser.role
    const userName = createUser.userName
    const [action, setAction ] =useState('')
  

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
        const req = new TrimSwatchStatus(value?.trim_swatch_id,value?.trim_swatch_number,undefined,undefined,form.getFieldValue('reason'))
        service.updateApprovedStatus(req).then((res)=>{
            if(res.status){
                message.success(res.internalMessage,2)
                navigate('/trims-swatch-approval',{ state: { tab: 'APPROVED' } })
                sendMailForApprovalUser('Approved ✅')
            }else{
                message.error(res.internalMessage,2)
            }
        })
      }


    
      const TrimRejected =(value)=>{
        console.log(value,'.......................')
        const req = new TrimSwatchStatus(value,undefined,form.getFieldValue('reason'))
        service.updateRejectedStatus(req).then((res)=>{
            if(res.status){
                message.success(res.internalMessage,2)
                navigate('/trims-swatch-approval',{ state: { tab: 'REJECTED' } })
                sendMailForApprovalUser('Rejected ❌')
                setModal(false)
                onReset()
            }else{
                message.error(res.internalMessage,2)
            }
        })
      }

      const TrimRework =(value)=>{
        console.log(value,'.......................')
        const req = new TrimSwatchStatus(value,undefined,undefined,form.getFieldValue('reason'))
        service.updateReworkStatus(req).then((res)=>{
            if(res.status){
                message.success(res.internalMessage,2)
                navigate('/trims-swatch-approval',{ state: { tab: 'REJECTED' } })
                sendMailForApprovalUser('Rework 🔁 ')
                setModal(false)
                onReset()
            }else{
                message.error(res.internalMessage,2)
            }
        })
      }

      const handelAccept = (value)=>{
        setAction('approve')
        setFormData(value)
        setModal(true)
      }

      const handelReject = (value)=>{
        setAction('reject')
        setFormData(value?.trim_swatch_id)
        setModal(true)
      }

      const handelRemove = (value)=>{
        setAction('rework')
        setFormData(value?.trim_swatch_id)
        setModal(true)
      }

          
      const handleFormSubmit = () => {
        if(action === 'approve'){
          TrimAccepted(formData)
        }else if(action === 'reject'){
          TrimRejected(formData);
        }else if(action === 'rework'){
        TrimRework(formData);
        }
      };

      const onModalCancel = () => {
        onReset()
        setModal(false);
      };
    
    
      const onReset = () => {
        form.resetFields();
      };

      const imageUrls = data.map(item => `http://dsw7.shahi.co.in/services/kanban-service/upload-files/${item?.file_name}`);


      let mailerSent = false;
      async function sendMailForApprovalUser(value) {
          const swatchDetails = new EmailModel();
          swatchDetails.swatchNo = data[0]?.trim_swatch_number
          // swatchDetails.to = 'kushal.siddegowda@shahi.co.in'
          swatchDetails.to = data[0]?.createdUserMail
          console.log(data[0]?.createdUserMail, '---------mail')
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
            <p>Please find the ${value} Trim Swatch details below:</p>
            <p>Trim Swatch No: ${data[0]?.trim_swatch_number}</p>
            <p>Buyer: ${data[0]?.buyerName}</p>
            <p>Supplier: ${data[0]?.supplier_name }</p>
            <p>Style No: ${data[0]?.style_no }</p>
            <p>Item No: ${data[0]?.item_no}</p>
            <p>Please click the link below for details:</p>
  
            <a
              href="http://dsw7.shahi.co.in/#/trims-swatch-detail-view/${data[0]?.trim_swatch_id}"
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
              message.success(`Alert mail sent to the ${data[0]?.createdUserMail}` )
          }
      }
  

      return (
        <div>
          <Card
            title={<span>Swatch No: {data[0]?.trim_swatch_number}</span>}
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
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Buyer</span>}><span style={{fontSize:'16px'}}>{data[0]?.buyerName || '--'}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Supplier</span> }><span style={{fontSize:'16px'}}>{data[0]?.supplier_name || '--'}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>PO No</span> }><span style={{fontSize:'16px'}}>{data[0]?.po_number || '--'}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Style No</span>}><span style={{fontSize:'16px'}}>{data[0]?.style_no || '--'}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Item No</span>}><span style={{fontSize:'16px'}}>{data[0]?.item_no || '--'}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Item Descrpition</span> }><span style={{fontSize:'16px'}}>{data[0]?.item_description || '--'}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Invoice No</span> }><span style={{fontSize:'16px'}}>{data[0]?.invoice_no || '--'}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>GRN No</span> }><span style={{fontSize:'16px'}}>{data[0]?.grn_number || '--'}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>GRN Date</span>}><span style={{fontSize:'16px'}}>{moment(data[0]?.grn_date || '--').format('YYYY-MM-DD')}</span></DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Created By</span> }>
                  <span style={{fontSize:'16px'}}>
                    {data[0]?.createdUser}
                  </span>
                </DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Created On</span> }>
                  <span style={{fontSize:'16px'}}>
                    {data[0]?.createdAt ? moment(data[0]?.createdAt).format('YYYY-MM-DD') : '-'}
                  </span>
                </DescriptionsItem>
                <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Status</span> }><span style={{fontSize:'16px'}}> {StatusDisplayEnum.find(item => item.name === data[0]?.status)?.displayVal || data[0]?.status}</span></DescriptionsItem>

                {/* {data[0]?.status === 'REJECTED' ?( */}
              <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Remarks</span>}>
                <span style={{fontSize:'16px'}}>
                  {data[0]?.status === 'REJECTED' && data[0]?.rejected_reason ||
                  data[0]?.status === 'APPROVED' && data[0]?.approvalReason ||
                  data[0]?.status === 'REWORK' && data[0]?.reworkReason  ||
                  data[0]?.status === 'SENT_FOR_APPROVAL' && data[0]?.remarks  || '--'}
                </span>   
              </DescriptionsItem>
              {/*  ):[]} */}
              <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Reworked</span> }>
                  <span style={{fontSize:'16px'}}>
                    {data[0]?.rework}
                  </span>
                </DescriptionsItem>
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
            <Card style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <Image.PreviewGroup items={imageUrls}>
          <Image
            src={`http://dsw7.shahi.co.in/services/kanban-service/upload-files/${data[0]?.fileName}`}
            alt="Preview"
            height={'300px'}
            width={'500px'}
            style={{
              width: '100%',
              objectFit: 'contain',
              marginRight: '100px',
            }}
          />
        </Image.PreviewGroup>
            </Card>
          
            </Col>
            </Row>
            {(userRole === 'ADMIN' || (userRole === 'MARKETING' && department === 1)) &&   data[0]?.status === 'SENT_FOR_APPROVAL' &&(
          <>
          <Divider type='horizontal'/>
            <div style={{ textAlign: 'center' }}>
                <Button  style={{backgroundColor:'green', color:'white'}} onClick={()=>handelAccept(data[0])}>APPROVE</Button>
                <Divider type='vertical'/>
                <Button type='primary' danger onClick={() => handelReject(data[0])}>REJECT</Button>
                {data[0]?.rework === 'NO' ? (
                  <>
                <Divider type='vertical'/>
                <Button  style={{backgroundColor:'orange', color:'white'}} onClick={() => handelRemove(data[0])}>REWORK</Button>
                </>
                ):null}
            </div>
            </>
            )}
          </Card>
          <Modal
            visible={modal}
            onCancel={onModalCancel}
            footer={null}
            style={{ maxWidth: '90%' }}
            destroyOnClose
            >

              <Card
                title={action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : action === 'rework' ? 'Rework' : '-'}
                size='small'
                headStyle={{ backgroundColor: '#25529a', color: 'white' }}
                >
                <Form form={form} layout='vertical' 
                onFinish={handleFormSubmit}
                >
                    <Row gutter={16}>
                    <Col xl={12} lg={12} xs={10}>
                        <Form.Item name='reason' label='Reason' rules={[{ required: true, message: 'Reason is required' }]}>
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
