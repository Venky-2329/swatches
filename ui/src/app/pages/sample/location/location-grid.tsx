import { Button, Card, Col, Row, Table } from "antd";
import { getLocationData } from "libs/shared-services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LocationGrid(){
    const navigate = useNavigate();
    const [data,setData] = useState([])

    useEffect(()=>{
        getData()
    },[])

    function getData(){
        getLocationData().then((res)=>{
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
            title:'Location',
            dataIndex:'locationName'
        }
     ];

    function goToForm(){
        navigate('/location-form')
    }

    return(
        <>
        <Card title='Seasons' extra={<span><Button onClick={goToForm} type="primary">Add</Button></span>}>
           <Row gutter={24}>
             <Col span={24}>
               <Table columns={columns} dataSource={data} ></Table>
             </Col>
           </Row>
        </Card>
        </>
    )
}