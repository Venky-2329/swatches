import { Button, Card, Col, Form, Row, Select, Table, message } from 'antd';
import { FabricSwatchService } from 'libs/shared-services';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const FabricSwatchGrid = () => {
    const Option = Select;
    const [form] = Form.useForm();
    const [ mainData, setMainData ] = useState<any[]>([])
    const navigate = useNavigate();


    const service = new FabricSwatchService()

    useEffect(()=>{
        getAllData()
    },[])

    const getAllData = ()=>{
        service.getAllFabricSwatchData().then((res)=>{
            if(res.status){
                setMainData(res.data)
                message.success(res.internalMessage,2)
            }else{
                setMainData([])
                message.error(res.internalMessage,2)
            }
        })
    }

    const columns: any = [
        {
          title: 'S.No',
          render: (val, record, index) => index + 1,
        },
        {
          title: 'Swatch Number',
          dataIndex: 'fabricSwatchNo',
        },
        {
          title: 'Buyer',
          dataIndex: 'buyerName',
        },
        {
          title: 'Brand',
          dataIndex: 'brandName',
        },
        {
          title: 'Category',
          dataIndex: 'categoryName',
        },
        {
          title: 'Season',
          dataIndex: 'seasonName',
        },
        {
          title: 'Style No',
          dataIndex: 'styleNo',
        },
        {
          title: 'Item No',
          dataIndex: 'itemNo',
        },
        {
          title: 'Category Type',
          dataIndex: 'categoryType',
        },
        {
          title: 'PO No',
          dataIndex: 'poNumber',
        },
        {
          title: 'GRN No',
          dataIndex: 'grnNumber',
        },
        {
          title: 'GRN Date',
          dataIndex: 'grnDate',
          render: (grnDate) => {
            const date = new Date(grnDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        },
        {
          title: 'Item Description',
          dataIndex: 'itemDescription',
        },
        {
          title: 'Mill/Vendor',
          dataIndex: 'mill',
        },
        {
          title: 'Status',
          dataIndex: 'status',
        }
      ]

      function gotoGrid() {
        navigate('/fabric-swatch-upload');
      }

  return (
    <div>
        <Card title="Fabric Swatch" extra={<span><Button type="primary" onClick={gotoGrid}>Create</Button></span>}>
            <Form form={form} layout='vertical'>
                <Row>
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                    <Form.Item name={'fabricSwatchNo'} label={'Swatch No'}>
                        <Select allowClear placeholder='Select Swatch No'>
                            {mainData.map((item)=>{
                                return(
                                <Option key={item.fabricSwatchId} value={item.fabricSwatchNo}>
                                    {item.fabricSwatchNo}
                                </Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table 
            columns={columns} 
            dataSource={mainData}
            scroll={{x:'max-content'}}/>
        </Card>
    </div>
  )
}

export default FabricSwatchGrid