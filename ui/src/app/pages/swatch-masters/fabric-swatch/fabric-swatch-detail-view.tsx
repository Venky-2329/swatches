import { Button, Card, Col, Descriptions, Modal, Row, Table, message, Image, Divider, Popconfirm, Tooltip, Form,} from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { EmailService, FabricSwatchService } from 'libs/shared-services';
import { EmailModel, StatusDisplayEnum, SwatchStatus } from 'libs/shared-models';
import img from '../../../../../../upload-files/shubham-dhage-rzqjQjGvOBQ-unsplash-4104e.jpg';
import TextArea from 'antd/es/input/TextArea';

export const FabricSwatchDetailView = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const page = 1;
  const navigate = useNavigate();
  const service = new FabricSwatchService();
  const { fabricSwatchId } = useParams<any>();
  const [imagePath, setImagePath] = useState('');
  const [tabName, setTabName] = useState<string>('SENT_FOR_APPROVAL');
  const [activeKey, setActiveKey] = useState('SENT_FOR_APPROVAL')
  const [formData, setFormData] = useState({});
  const [modal, setModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const mailService = new EmailService()
  const createUser = JSON.parse(localStorage.getItem('auth'));
  const department = createUser.departmentId
  const userRole = createUser.role
  const userName = createUser.userName
  const [action, setAction] = useState(null);


  const location = useLocation();
  const currentRoute = location.pathname;

  useEffect(() => {
    getSwatchDetails();
  }, [fabricSwatchId]);

  const getSwatchDetails = () => {
    const req = new SwatchStatus(Number(fabricSwatchId), undefined, undefined);
    service.getDataById(req).then((res) => {
      if (res.status) {
        setData(res.data);
      }
    });
  };

  const fabricAccepted = (value)=>{
    const req = new SwatchStatus(value?.fabricSwatchId,value?.fabricSwatchNo,undefined,undefined,form.getFieldValue('remarks'))
    service.updateApprovedStatus(req).then((res)=>{
        if(res.status){
            message.success(res.internalMessage,2)
            navigate('/fabric-swatch-approval',{ state: { tab: 'APPROVED' } })
            sendMailForApprovalUser('Approved ✅')
        }else{
            message.error(res.internalMessage,2)
        }
    })
  }

  const fabricRejected =(value)=>{
    const req = new SwatchStatus(value,undefined,form.getFieldValue('remarks'))
    service.updateRejectedStatus(req).then((res)=>{
        if(res.status){
            message.success(res.internalMessage,2)
            navigate('/fabric-swatch-approval',{state:{tab:'REJECTED'}})
            sendMailForApprovalUser('Rejected ❌')
            setModal(false)
            onReset()
        }else{
            message.error(res.internalMessage,2)
        }
    })
  }

  const fabricRework =(value)=>{
    const req = new SwatchStatus(value,undefined,undefined,form.getFieldValue('remarks'))
    service.updateReworkStatus(req).then((res)=>{
        if(res.status){
            message.success(res.internalMessage,2)
            navigate('/fabric-swatch-approval',{state:{tab:'REJECTED'}})
            sendMailForApprovalUser('Rework 🔁')
            setModal(false)
            onReset()
        }else{
            message.error(res.internalMessage,2)
        }
    })
  }

  
  const handleApprove =(value)=>{
    setAction('approve')
    setFormData(value.fabricSwatchId)
    setModal(true)
  }

  
  const handelReject = (value)=>{
    setAction('reject')
    setFormData(value?.fabricSwatchId)
    setModal(true)
  }

  const handelRework = (value)=>{
    setAction('rework')
    setFormData(value?.fabricSwatchId)
    setModal(true)
  }

  const handleFormSubmit = () => {
    if (action === 'approve') {
      fabricAccepted(formData);
    } else if (action === 'reject') {
      fabricRejected(formData);
    } else if(action === 'rework'){
      fabricRework(formData)
    }
  };

  let mailerSent = false;
    async function sendMailForApprovalUser(value) {
        const swatchDetails = new EmailModel();
        swatchDetails.swatchNo = data[0]?.fabricSwatchNo
        swatchDetails.to = data[0]?.createdUserMail
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
          <p>Please find the ${value} Fabric Swatch details below:</p>
          <p>Fabric Swatch No: ${data[0]?.fabricSwatchNo}</p>
          <p>Buyer: ${data[0]?.buyerName}</p>
          <p>Brand: ${data[0]?.brandName}</p>
          <p>Style No: ${data[0]?.styleNo}</p>
          <p>Item No: ${data[0]?.itemNo}</p>
          <p>Please click the link below for details:</p>

          <a
            href="http://localhost:4200/#/fabric-swatch-detail-view/${data[0]?.fabricSwatchId}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            "
            >View Details of ${data[0]?.fabricSwatchNo}</a
          >

        </body>
      </html>
      `
        swatchDetails.subject = "Fabric Swatch : " + data[0]?.fabricSwatchNo
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
            message.success(`Alert mail sent to the ${data[0]?.createdUserMail}`)
        }
    }

  const onReset = () => {
    form.resetFields();
  };

  const onModalCancel = () => {
    onReset()
    setModal(false);
  };

  return (
    <div>
      <Card
      style={{width:'100%'}}
        title={<span>Swatch No: {data[0]?.fabricSwatchNo}</span>}
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        extra={
          !((userRole === 'FABRICS') && (department === 3)) && (
            <span style={{ color: 'white' }}>
              <Button className="panel_button" onClick={() => { navigate('/fabric-swatch-approval'); }}>
                BACK
              </Button>
            </span>
          )
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
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Buyer</span>}>
              <span style={{fontSize:'16px'}}>
                {data[0]?.buyerName || '--'}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Style No</span>}>
              <span style={{fontSize:'16px'}}>
                {data[0]?.styleNo}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Item No</span>}>
              <span style={{fontSize:'16px'}}>
                {data[0]?.itemNo}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Category Type</span> }>
              <span style={{fontSize:'16px'}}>
                {data[0]?.categoryType}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Color</span> }>
              <span style={{fontSize:'16px'}}>
                {data[0]?.color}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>PO No</span>}>
              <span style={{fontSize:'16px'}}>
                {data[0]?.poNumber}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>GRN No</span> }>
              <span style={{fontSize:'16px'}}>
                {data[0]?.grnNumber}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>GRN Date</span> }>
              <span style={{fontSize:'16px'}}>
              {data[0]?.grnDate ? moment(data[0]?.createdDate).format('YYYY-MM-DD') : '-'}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Item Description</span> }>
              <span style={{fontSize:'16px'}}>
                {data[0]?.itemDescription}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Mill/Vendor</span> }>
              <span style={{fontSize:'16px'}}>
                {data[0]?.mill}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Brand</span> }>
              <span style={{fontSize:'16px'}}>
                {data[0]?.brandName || '--'}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Category</span> }>
              <span style={{fontSize:'16px'}}>
                {data[0]?.categoryName || "--"}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Season</span> }>
              <span style={{fontSize:'16px'}}>
                {data[0]?.seasonName || "--"}
              </span>
            </DescriptionsItem>
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>GRN Date</span>}>
              <span style={{fontSize:'16px'}}>
                {data[0]?.grnDate ? moment(data[0]?.grnDate).format('YYYY-MM-DD') : '-'}
              </span>
            </DescriptionsItem>
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
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Status</span>}>
              <span style={{fontSize:'16px'}}>
                {StatusDisplayEnum.find(item => item.name === data[0]?.status)?.displayVal || data[0]?.status}
              </span>
            </DescriptionsItem>
            {data[0]?.status === 'REJECTED' ?(
            <DescriptionsItem label={<span style={{ fontWeight: 'bold', color: 'darkblack', fontSize:'16px' }}>Rejection Reason</span>}>
              <span style={{fontSize:'16px'}}>
                {data[0]?.rejectionReason || "--"}
              </span>
            </DescriptionsItem>):[]}
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
        </Col>
        </Row>
        { (userRole === 'ADMIN' || (userRole === 'MARKETING' && department === 1)) && data[0]?.status === 'SENT_FOR_APPROVAL' && (
          <>
            <Divider type='horizontal'/>
            <div style={{ textAlign: 'center' }}>
                <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleApprove(data[0])}>APPROVE</Button>
              <Divider type='vertical'/>
              <Button type='primary' danger onClick={() => handelReject(data[0])}>REJECT</Button>
              {data[0]?.rework === 'NO' ? (
                <>
                  <Divider type='vertical' />
                  <Button style={{ backgroundColor: 'orange', color: 'white' }} onClick={() => handelRework(data[0])}>REWORK</Button>
                </>
              ) : null}
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
                    <Form.Item name='remarks' label='Reason' rules={[{ required: true, message: 'Reason is required' }]}>
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

export default FabricSwatchDetailView;
