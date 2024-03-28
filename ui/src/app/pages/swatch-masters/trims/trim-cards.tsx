import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Col, Form, Row, Select } from "antd";
import { Option } from "antd/es/mentions";
import { ApprovalUserService, BuyerService, SupplierService, TrimSwatchService } from "libs/shared-services";
import { useEffect, useState } from "react";

export default function TrimCards() {
   const buyerService = new BuyerService()
   const trimsService = new TrimSwatchService()
   const supplierService = new SupplierService()
   const approvalService = new ApprovalUserService()
   const [buyer , setBuyer] = useState<any[]>([])
   const [grnNo , setGrnNo] = useState<any[]>([])
   const [supplier , setSupplier] = useState<any[]>([])
   const [poNo , setPoNo] = useState<any[]>([])
   const [styleNo , setStyleNo] = useState<any[]>([])
   const [itemNo , setItemNo] = useState<any[]>([])
   const [approvalUser , setApprovalUser] = useState<any[]>([])
   const [form] = Form.useForm()

    useEffect(()=> {
        getBuyers();
        getGrnNo();
        getSupplier();
        getPoNo();
        getApprovalUser();
        getStyleNo();
        getItemNo();
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

    function onReset(){
        form.resetFields();
    }



    return(
        <Card title={
            <span>Trim Swatch Cards</span>}
            headStyle={{ backgroundColor: '#25529a', color: 'white' }}
            // {<Badge count={data.length} style={{ backgroundColor: '#52c41a' }}/>}
        >
        <Form form={form} layout="vertical">
            <Row gutter={24}>
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
                                return <Option value={items.grnId}>{items.grnNo}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Supplier' name={'supplier'}>
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
                                return <Option value={items.poId}>{items.PoNo}</Option>
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
                                return <Option value={items.styleId}>{items.styleNo}</Option>
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
                                return <Option value={items.itemId}>{items.itemNo}</Option>
                            })}
                        </Select>

                    </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:4}}>
                    <Form.Item label='Approver' name={'approver'}>
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
           <Button type='primary' onClick={onReset}>Submit</Button>
          </Col>
          <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 1 }}>
              <Button onClick={onReset}>Reset</Button>
          </Col>
        </Row>
        </Form>
        </Card>
    )
}