import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, FloatButton, Form, Row, Select, message } from "antd";
import Meta from "antd/es/card/Meta";
import { Option } from "antd/es/mentions";
import { ApprovalUserService, BuyerService, FabricSwatchService, SupplierService, TrimSwatchService } from "libs/shared-services";
import moment from "moment";
import { CSSProperties, useEffect, useState } from "react";
import image from '../../../../../../upload-files/AOB_SwatchBookPT4.webp'
import { useNavigate } from "react-router-dom";
import { DateReq, StatusDisplayEnum, TrimCardReq } from "libs/shared-models";

export default function FabricSwatch() {
   const [data, setData] = useState([]);
   const [form] = Form.useForm()
   const navigate  = useNavigate()
   const service = new FabricSwatchService()
   const [ buyerData, setBuyerData ] = useState<any[]>([])
   const [ brandData, setBrandData ] = useState<any[]>([])
   const [ swatchNoData, setSwatchNoData ] = useState<any[]>([])
   const [ createdByData, setCreatedByData ] = useState<any[]>([])

    useEffect(()=> {
        getCards()
        getAllBuyers()
        getAllCreatedBy()
        getAllBrands()
    },[])

    function onReset(){
        form.resetFields();
        getCards()
    }

    const getAllBuyers = ()=>{
        service.getAllFabricBuyers().then((res)=>{
            if(res.status){
            setBuyerData(Array.isArray(res.data) ? res.data : []);
            }
        })
    }

    const getAllBrands = ()=>{
        service.getAllBrands().then((res)=>{
            if(res.status){
            setBrandData(res.data)
            }
        })
    }

    const getAllCreatedBy = ()=>{
        service.getAllCreatedBy().then((res)=>{
            setCreatedByData(Array.isArray(res.data) ? res.data : []);
        })
    }

    function getCards() {
        const req = new DateReq();
        
        if(form.getFieldValue('buyerId') != undefined){
            req.buyerId = form.getFieldValue('buyerId')
        }
        if(form.getFieldValue('brandId') != undefined){
            req.brandId = form.getFieldValue('brandId')
        }
        if(form.getFieldValue('swatchNo') != undefined){
            req.swatchNo = form.getFieldValue('swatchNo')
        }
        if(form.getFieldValue('createdBy') != undefined){
            req.createdBy = form.getFieldValue('createdBy')
        }
        if(form.getFieldValue('styleNo') != undefined){
            req.styleNo = form.getFieldValue('styleNo')
        }
        if(form.getFieldValue('itemNo') != undefined){
            req.itemNo = form.getFieldValue('itemNo')
        }
        if(form.getFieldValue('approverId') != undefined){
            req.approverId = form.getFieldValue('approverId')
        }
        
        service.getAllFabricSwatchData(req).then((res)=>{
            if(res.data){
                setData(res.data);
            }else{
                message.error(res.internalMessage,2)
            }
        })
    }

    const ViewDetails=(values)=>{
        navigate(`/fabric-swatch-detail-view/${values.fabricSwatchId}`)
    }

    // const backgroundColors = ['#c8ffc8', '#ffffa0', '#facefa', '#ccccff','#ffd2d2','#d2e1ff','#d2faff','#ffeee8'];
    const backgroundColors = ['#FFE4E1', '#FFD8BE', '#FAFAD2', '#E9E9FF', '#EFDEEF', '#FFBCD9', '#EEE8AA', '#BCFFC3'];

    return(
        <Card title={
            <span>Fabric Swatch Cards</span>}
            headStyle={{ backgroundColor: '#25529a', color: 'white' }}
            // {<Badge count={data.length} style={{ backgroundColor: '#52c41a' }}/>}
        >
        <Form form={form} layout="vertical">
            <Row gutter={24}>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Swatch No' name={'swatchNo'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Swatch No' >
                            {data?.map((items) =>{
                                return <Option value={items.fabricSwatchNo}>{items.fabricSwatchNo}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Buyer' name={'buyerId'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Buyer' >
                            {buyerData?.map((items) =>{
                                return <Option key={items.buyer_id} value={items.buyer_id}>{items.buyerName}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Brand' name={'brandName'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Brand' >
                            {brandData?.map((items) =>{
                                return <Option key={items.brand_id} value={items.brand_id}>{items.brandName}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Created By' name={'createdBy'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Created By' >
                            {createdByData?.map((items) =>{
                                return <Option key={items.createdBy} value={items.createdBy}>{items.createdBy}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                {/* <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Style No' name={'styleNo'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Style No' >
                            {styleNo.map((items) =>{
                                return <Option value={items.styleNo}>{items.styleNo}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Item No' name={'itemNo'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Item No' >
                            {itemNo.map((items) =>{
                                return <Option value={items.itemNo}>{items.itemNo}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col> */}
            </Row>
            <Row justify='end'>
            <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 2}}>  
           <Button type='primary' onClick={getCards}>Submit</Button>
          </Col>
          <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 1 }}>
              <Button onClick={onReset}>Reset</Button>
          </Col>
        </Row>
        </Form>
        <br/>
        <Row gutter={[16,16]} >
            {data.map((i,index) => {
                const {buyerName , brandName , styleNo , itemNo  , createdAt , status, fabricSwatchNo } = i
                const date = moment(createdAt).format('YYYY-MM-DD')
                const cardStyle : CSSProperties = {
                    background: backgroundColors[index % backgroundColors.length],
                    color: 'black',
                    height: '100%', // Adjust the height of the card
                    width: '100%', // Adjust the width of the card
                    display: 'flex', // Align cards correctly
                    flexDirection: 'column' ,
                };
                return(
                    <Col key={i.fabricSwatchId} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6}}>
                        <Card
                        hoverable
                        style={cardStyle}
                        cover={
                            <img
                            style={{ height: '200px', objectFit: 'cover' }}
                              alt="example"
                              src={'http://dsw7.shahi.co.in/services/kanban-service/upload-files/'+i.fileName}
                              onClick={() => ViewDetails(i)}
                            />
                          }
                        >
                    <Meta
                  description={
                    <div className="print">
                        <div>Swatch No: <b>{fabricSwatchNo}</b></div>
                      <div>Buyer: <b>{buyerName}</b></div>
                      <div>Created On: <b>{date}</b></div>
                      <div>Style No: <b>{styleNo}</b></div>
                      <div>Item No: <b>{itemNo}</b></div>
                      <div>Status: <b>{StatusDisplayEnum.find((item) => item.name === status)?.displayVal || status}</b></div>
                    </div>
                  }
                />
                </Card>
                    </Col>
                )
            })}
        </Row>
        <FloatButton.BackTop type='primary'/>
        </Card>
    )
}