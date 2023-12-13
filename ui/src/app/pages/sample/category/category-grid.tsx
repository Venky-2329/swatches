import { Button, Card, Col, Row, Table } from "antd";
import { getBrandsData, getCategoryData } from "libs/shared-services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BrandsGrid(){
    const navigate = useNavigate();
    const [data,setData] = useState([])

    useEffect(()=>{
        getData()
    },[])

    function getData(){
        getCategoryData().then((res)=>{
            if(res.data){
                setData(res.data)
            }
        })
    }

     const columns = [
        {
            title:'S.No',
            render:(val,record,index) => index + 1
        },
        {
            title:'Category Name',
            dataIndex:'categoryName'
        }
     ];

    function goToForm(){
        navigate('/category-form')
    }

    return(
        <>
        <Card title='Categories' extra={<span><Button onClick={goToForm} type="primary">Add</Button></span>}>
           <Row gutter={24}>
             <Col span={24}>
               <Table columns={columns} dataSource={data} ></Table>
             </Col>
           </Row>
        </Card>
        </>
    )
}