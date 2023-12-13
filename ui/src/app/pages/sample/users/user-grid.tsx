import { Button, Card, Col, Row, Table } from "antd";
import { getLocationData, getUserData } from "libs/shared-services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserGrid(){
    const navigate = useNavigate();
    const [data,setData] = useState([])

    useEffect(()=>{
        getData()
    },[])

    function getData(){
        getUserData().then((res)=>{
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
            dataIndex:'userName'
        }
     ];

    function goToForm(){
        navigate('/user-form')
    }

    return(
        <>
        <Card title='Users' extra={<span><Button onClick={goToForm} type="primary">Add</Button></span>}>
           <Row gutter={24}>
             <Col span={24}>
               <Table columns={columns} dataSource={data} ></Table>
             </Col>
           </Row>
        </Card>
        </>
    )
}