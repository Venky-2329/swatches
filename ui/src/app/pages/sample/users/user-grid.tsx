import { Button, Card, Col, Divider, Drawer, Popconfirm, Row, Switch, Table, message } from "antd";
import { DeleteOutlined, EditOutlined , RightSquareOutlined } from '@ant-design/icons';
import { activateOrDeactivateUser, getLocationData, getUserData, updateUser } from "libs/shared-services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./user-form";
import { UserDto, userReq } from "libs/shared-models";

export default function UserGrid(){
    const navigate = useNavigate();
    const [data,setData] = useState([])
    const [drawerVisible , setDrawerVisible] = useState(false)
    const [selectedUser , setSelectedUser] = useState<any>(undefined)

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

    const openFormWithData = (view : UserDto) => {
        setDrawerVisible(true)
        setSelectedUser(view)
    }

    const closeDrawer = () => {
        setDrawerVisible(false);
    }

    const update = (user : any) => {
        updateUser(user).then((res) => {
           if(res.status){
            message.success('updated successfully ' , 2);
            setDrawerVisible(false)
            getData()
           }else{
            message.error(res.internalMessage , 2)
           }
        })
    }

    const activateOrDeactivate = (val: userReq) => {
        val.isActive = val.isActive ? false:true;
        activateOrDeactivateUser(val).then((res) => {
          if (res.status) {
            message.success(res.internalMessage, 2);
            getData();
          } else {
            message.error(res.internalMessage,2);
          }
        });
      };

     const columns = [
        {
            title:'S.No',
            render:(val,record,index) => index + 1
        },
        {
            title:'User Name',
            dataIndex:'userName'
        },
        {
            title:'Action',
            dataIndex:'action',
            render : (val , rowData) => (
                <>
                <EditOutlined 
                type="edit"
                onClick={() => {
                    if(rowData.isActive){
                        openFormWithData(rowData);
                    }else{
                        message.error('you cannot edit deactivated user')
                    }
                }}
                style={{ color: '#1890ff', fontSize: '14px' }}
                />
                <Divider type="vertical" />
                <Popconfirm
              onConfirm={(e) => {
                activateOrDeactivate(rowData);
              }}
              title={
                rowData.isActive
                  ? 'Are you sure to Deactivate User ?'
                  : 'Are you sure to Activate User ?'
              }
            >
              <Switch
                size="default"
                className={
                  rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'
                }
                checkedChildren={<RightSquareOutlined type="check" />}
                unCheckedChildren={<RightSquareOutlined type="close" />}
                checked={rowData.isActive}
              />
            </Popconfirm>
                </>
            )
        },

     ];

    function goToForm(){
        navigate('/user-form')
    }

    return(
        <>
        <Card title='Users' 
        headStyle={{ backgroundColor: '#25529a', color: 'white' }} 
        extra={<span><Button onClick={goToForm}>Add</Button></span>}>
           <Row gutter={24}>
             <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 24}}>
               <Table columns={columns} dataSource={data} ></Table>
             </Col>
           </Row>
           <Drawer 
           bodyStyle={{paddingBottom : 80}} 
           title = 'Update'
           width={window.innerWidth > 768 ? '80%' : '85%'}
            visible = {drawerVisible}
            onClose={closeDrawer}
           >
           <UserForm 
           key={Date.now()}
           updateDetails={update}
           isUpdate={true}
           userData={selectedUser}
            closeform={closeDrawer}
           /> </Drawer>
        </Card>
        </>
    )
}