import { Button, Card, Col, Row, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BrandsGrid(){
    const navigate = useNavigate();
    const [brandData,setBrandData] = useState([])

    const data =[
        {
            brandCode:'HM',
            brandName:'H&M'
        },
        {
            brandCode:'Wrong',
            brandName:'Wrong'
        }
    ]

     const columns = [
        {
            title:'S.No',
            render:(val,record,index) => index + 1
        },
        {
            title :'Brand Code',
            dataIndex:'brandCode'
        },
        {
            title:'BrandName',
            dataIndex:'brandName'
        }
     ];

    function goToForm(){
        navigate('/brands-form')
    }

    return(
        <>
        <Card title='Brands' extra={<span><Button onClick={goToForm} type="primary">Add</Button></span>}>
           <Row gutter={24}>
             <Col span={24}>
               <Table columns={columns} dataSource={data} ></Table>
             </Col>
           </Row>
        </Card>
        </>
    )
}