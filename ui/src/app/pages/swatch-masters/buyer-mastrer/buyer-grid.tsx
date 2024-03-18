import {
    Button,
    Card,
    Col,
    Divider,
    Drawer,
    Popconfirm,
    Row,
    Switch,
    Table,
    message,
  } from 'antd';
  import {
    RightSquareOutlined,
    SearchOutlined,
  } from '@ant-design/icons';
  import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { BuyerService } from 'libs/shared-services';
import BuyerForm from './buyer-form';
import { BuyerDto, BuyerReq } from 'libs/shared-models';
  
  export default function BuyerGrid() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedBuyer, setSelectedBuyer] = useState<any>(undefined);
    const service =  new BuyerService
  
    useEffect(() => {
      getData();
    }, []);
  
    function getData() {
      service.getAllBuyers().then((res) => {
        if (res.data) {
          setData(res.data);
        }
      });
    }
  
    const updateBuyer = (buyer: BuyerDto) => {
      const authdata = JSON.parse(localStorage.getItem(''));
  
      console.log(buyer.updatedUser);
      service.updateBuyers(buyer).then((res) => {
        if (res.status) {
          message.success('Updated Succesfully');
          setDrawerVisible(false);
          getData();
        } else {
          message.error(res.internalMessage);
        }
      });
    };
  
    const deletebuyer = (val: BuyerReq) => {
      val.isActive = val.isActive ? false:true;
      service.activateOrDeactivateBuyer(val).then((res) => {
        if (res.status) {
          // console.log('okkkkkkkkkkk');
          message.success(res.internalMessage, 2);
          getData();
        } else {
          message.error(res.internalMessage);
        }
      });
    };
  
    // console.log(deletebuyer, '....................delete buyer');
  
    const openFormWithData = (viewData: BuyerDto) => {
      console.log(viewData);
      setDrawerVisible(true);
      setSelectedBuyer(viewData);
    };
  
    const closeDrawer = () => {
      setDrawerVisible(false);
    };
  
    const columns: any = [
      {
        title: 'S.No',
        render: (val, record, index) => index + 1,
      },
      {
        title: 'Buyer Name',
        dataIndex: 'buyerName',
      },
      {
        title: `Action`,
        dataIndex: 'action',
        align: 'center',
        render: (text, rowData) => (
          <span>
            <EditOutlined
              // className={'editSamplTypeIcon'}
              type="edit"
              onClick={() => {
                if (rowData.isActive) {
                  openFormWithData(rowData);
                } else {
                  message.error('You Cannot Edit Deactivated Buyer');
                }
              }}
              style={{ color: '#1890ff', fontSize: '14px' }}
            />
  
            <Divider type="vertical" />
            <Popconfirm
              onConfirm={(e) => {
                deletebuyer(rowData);
              }}
              title={
                rowData.isActive
                  ? 'Are you sure to Deactivate Address ?'
                  : 'Are you sure to Activate Address ?'
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
          </span>
        ),
      },
    ];
  
    function goToForm() {
      navigate('/buyer-form');
    }
  
    return (
      <>
        <Card
          title="Buyers"
          extra={
            <span>
              <Button onClick={goToForm} type="primary">
                Add
              </Button>
            </span>
          }
        >
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 24 }}
            >
              <Table columns={columns} dataSource={data}></Table>
            </Col>
          </Row>
          <Drawer
            bodyStyle={{ paddingBottom: 80 }}
            title="update"
            width={window.innerWidth > 768 ? '80%' : '85%'}
            visible={drawerVisible}
            onClose={closeDrawer}
          >
            <Card
              headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }}
              size="small"
            >
              <BuyerForm
                key={Date.now()}
                updateDetails={updateBuyer}
                isUpdate={true}
                buyerData={selectedBuyer}
                closeForm={closeDrawer}
              />
            </Card>
          </Drawer>
        </Card>
      </>
    );
  }
  