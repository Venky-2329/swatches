import { Button, Card, Divider, Drawer, Input, Popconfirm, Space, Switch, message } from 'antd';
import {
  RightSquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import { Link } from 'react-router-dom';
import { ApprovalUserService } from 'libs/shared-services';
import { ApprovalUserReq, ApprovedUserDto } from 'libs/shared-models';
import ApprovedUserForm from './authorised-form';

export default function ApproverGrid() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [drawerVisible , setDrawerVisible] = useState(false)
  const [selectedApproval , setSelectedApproval] = useState<any>(undefined)
  const service = new ApprovalUserService();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    service.getAllApprovalUser().then((res) => {
      if (res.data) {
        setData(res.data);
      }
    });
  };

  const openFormWithData = (viewData: ApprovedUserDto) => {
    setDrawerVisible(true);
    setSelectedApproval(viewData);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  }

  const updateUser = (val : ApprovedUserDto ) => {
    service.updateApprovalUser(val).then((res) => {
      if(res.status){
        message.success(res.internalMessage , 2)
        setDrawerVisible(false);
        getData();
      }else{
        message.error(res.internalMessage , 2)
      }
    })
  }

  const activateOrDeactivateUser =( req : ApprovalUserReq) => {
    req.isActive = req.isActive ? false:true
    service.activateOrDeactivateUser(req).then((res) => {
      if(res.status) {
        message.success(res.internalMessage , 2)
      }else{
        message.error(res.internalMessage , 2)
      }
    }) 
  }

  const columns: ColumnsType<any> = [
    {
      title: 'S.No',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Approver Name',
      dataIndex: 'approvedUserName',
    },
    {
      title: 'Email ID',
      dataIndex: 'emailId',
    },
    { 
      title: 'Actions',
      dataIndex: 'actions',
      align: 'center',
      render: (text , rowData) => (
        <span>
          {/* <EditOutlined
          type='edit'
          onClick={() => {
            console.log(rowData,"rowdatatatata")
            if (rowData.isActive) {
            openFormWithData(rowData);
          }else{
            message.error('You Cannot Edit Deactivated User');
          }
        }} 
        style={{ color: '#1890ff', fontSize: '14px' }}           />

        <Divider type="vertical" /> */}
                    <Popconfirm onConfirm={e => { activateOrDeactivateUser(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to deactivate this user ?'
                                : 'Are you sure to activate this user ?'
                        }
                    >
                        <Switch 
                         size='default'
                         className={rowData.isActive ?  'toggle-activated' : 'toggle-deactivated'}
                         checkedChildren = {< RightSquareOutlined type='check' />}
                         unCheckedChildren = {< RightSquareOutlined type='close' />}
                         checked={rowData.isActive}
                        ></Switch>
                    </Popconfirm>
        </span>
      )
      
    },
  ];

  return (
    <>
      <Card
        title={'Approvers'}
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        extra={
          <Link to="/approval-form">
            <Button>Create </Button>
          </Link>
        }
      >
        <Table
          rowKey={(record) => record.key}
          columns={columns}
          dataSource={data}
        ></Table>
        <Drawer 
         bodyStyle={{ paddingBottom: 80 }}
         title="update"
         width={window.innerWidth > 768 ? '80%' : '85%'}
         visible={drawerVisible}
         onClose={closeDrawer} >

          <ApprovedUserForm 
          key={Date.now()}
          updateApprovalUser={updateUser}
          isUpdate = {true}
          data = {selectedApproval}
          closeForm={closeDrawer}
          />
          
         </Drawer>
      </Card>
    </>
  );
}
