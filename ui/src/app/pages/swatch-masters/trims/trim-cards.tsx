import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, FloatButton, Form, Row, Select, message } from "antd";
import Meta from "antd/es/card/Meta";
import { Option } from "antd/es/mentions";
import { ApprovalUserService, BuyerService, SupplierService, TrimSwatchService } from "libs/shared-services";
import moment from "moment";
import { CSSProperties, useEffect, useState } from "react";
import image from '../../../../../../upload-files/pexels-orlando-s-18290475-101bf.jpg'
import { useNavigate } from "react-router-dom";
import { DateReq, TrimCardReq } from "libs/shared-models";

export default function TrimCards() {
   const buyerService = new BuyerService()
   const trimsService = new TrimSwatchService()
   const supplierService = new SupplierService()
   const approvalService = new ApprovalUserService()
   const [swatchNo , setSwatchNo] = useState<any[]>([])
   const [buyer , setBuyer] = useState<any[]>([])
   const [grnNo , setGrnNo] = useState<any[]>([])
   const [supplier , setSupplier] = useState<any[]>([])
   const [poNo , setPoNo] = useState<any[]>([])
   const [styleNo , setStyleNo] = useState<any[]>([])
   const [itemNo , setItemNo] = useState<any[]>([])
   const [approvalUser , setApprovalUser] = useState<any[]>([])
   const [data, setData] = useState([]);
   const [form] = Form.useForm()
   const navigate  = useNavigate()

    useEffect(()=> {
        getBuyers();
        getGrnNo();
        getSupplier();
        getPoNo();
        getApprovalUser();
        getStyleNo();
        getItemNo();
        getTrimCards();
        getswatchNo();
    },[])

    function getBuyers(){
        buyerService.getAllBuyers().then((res)=> {
            if(res.data){
                setBuyer(res.data)
            }
        })
    }

    function getGrnNo(){
        trimsService.getGrnNo().then((res) =>{
            if(res.data){
                setGrnNo(res.data) 
            }
        })
    }

    function getSupplier(){
        supplierService.getAllSuppliers().then((res) => {
            if(res.data){
                setSupplier(res.data)
            }
        })
    }

    function getPoNo(){
        trimsService.getPoNo().then((res) =>{
            if(res.data){
                setPoNo(res.data) 
            }
        })
    }

    function getApprovalUser(){
        approvalService.getAllApprovalUser().then((res) =>{
            if(res.data){
                setApprovalUser(res.data)
            }
        })
    }

    function getStyleNo(){
        trimsService.getStyleNo().then((res)=>{
            if(res.data){
                setStyleNo(res.data)
            }
        })
    }

    function getItemNo(){
        trimsService.getItemNo().then((res)=>{
            if(res.data){
                setItemNo(res.data)
            }
        })
    }

    function getswatchNo(){
        trimsService.getSwatchNo().then((res)=>{
            if(res.data){
                setSwatchNo(res.data)
            }
        })
    }

    function onReset(){
        form.resetFields();
    }

    function getTrimCards() {
        const req = new DateReq();
        console.log(req);
        
        if(form.getFieldValue('buyerId') != undefined){
            req.buyerId = form.getFieldValue('buyerId')
        }
        if(form.getFieldValue('grnNo') != undefined){
            req.grnNo = form.getFieldValue('grnNo')
        }
        if(form.getFieldValue('supplierId') != undefined){
            req.supplierId = form.getFieldValue('supplierId')
        }
        if(form.getFieldValue('poNo') != undefined){
            req.poNo = form.getFieldValue('poNo')
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
        
        trimsService.getAllTrimSwatchData(req).then((res)=>{
            if(res.data){
                setData(res.data);
            }else{
                message.error(res.internalMessage,2)
            }
        })
    }

    const ViewDetails=(values)=>{
        navigate(`/trims-swatch-detail-view/${values.trim_swatch_id}`)
    }

    // const backgroundColors = ['#c8ffc8', '#ffffa0', '#facefa', '#ccccff','#ffd2d2','#d2e1ff','#d2faff','#ffeee8'];
    const backgroundColors = ['#FFE4E1', '#FFD8BE', '#FAFAD2', '#E9E9FF', '#EFDEEF', '#FFBCD9', '#EEE8AA', '#BCFFC3'];    return(
        <Card title={
            <span>Trim Swatch Cards</span>}
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
                            {swatchNo.map((items) =>{
                                return <Option value={items.trimSwatchNumber}>{items.trimSwatchNumber}</Option>
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
                            {buyer.map((items) =>{
                                return <Option value={items.buyerId}>{items.buyerName}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='GRN No' name={'grnNo'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select GRN No' >
                            {grnNo.map((items) =>{
                                return <Option value={items.grnNo}>{items.grnNo}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Supplier' name={'supplierId'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Supplier' >
                            {supplier.map((items) =>{
                                return <Option value={items.supplierId}>{items.supplierName}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Po No' name={'poNo'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Po No' >
                            {poNo.map((items) =>{
                                return <Option value={items.poNo}  key={items.poNo}>{items.PoNo}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
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
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Approver' name={'approverId'}>
                        <Select 
                        allowClear
                        showSearch  
                        optionFilterProp="children"
                        placeholder='Select Approver' >
                            {approvalUser.map((items) =>{
                                return <Option value={items.approvedUserId}>{items.approvedUserName}</Option>
                            })}
                        </Select>
                    </Form.Item> 
                </Col>
            </Row>
            <Row justify='end'>
            <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 2}}>  
           <Button type='primary' onClick={getTrimCards}>Submit</Button>
          </Col>
          <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 1 }}>
              <Button onClick={onReset}>Reset</Button>
          </Col>
        </Row>
        </Form>
        <br/>
        <Row gutter={[24,24]} >
            {data.map((i,index) => {
                const {buyerName , grn_number , style_no , item_no  , created_at , trim_swatch_id ,trim_swatch_number,status } = i
                const date = moment(created_at).format('YYYY-MM-DD')
                const cardStyle : CSSProperties = {
                    background: backgroundColors[index % backgroundColors.length],
                    color: 'black',
                    height: '100%', // Adjust the height of the card
                    width: '100%', // Adjust the width of the card
                    display: 'flex', // Align cards correctly
                    flexDirection: 'column' ,
                };
                return(
                    <Col key={i.sampleId} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6}}>
                        <Card
                        hoverable
                        style={cardStyle}
                        cover={
                            <img
                            style={{ height: '100%', objectFit: 'cover' }}
                              alt="example"
                            //   src={'http://172.20.50.169/design_room/dist/services/kanban-service/upload-files/'+ i.fileName}
                            src={image}
                              onClick={() => ViewDetails(i)}
                            />
                          }
                        >
                    <Meta
                  description={
                    <div className="print">
                      <div><b>{buyerName}</b></div>
                      <div><b>{date}</b></div>
                      <div>Style No&nbsp;&nbsp; : {style_no}</div>
                      <div>GRN No&nbsp;&nbsp; : {grn_number}</div>
                      <div>Swatch No &nbsp; : {trim_swatch_number}</div>
                      <div>Status &nbsp; : {status}</div>
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