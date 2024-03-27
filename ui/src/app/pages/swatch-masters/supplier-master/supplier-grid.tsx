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
import SupplierForm from './supplier-form';
import { SupplierService } from 'libs/shared-services';
import { supplierDto, supplierReq } from 'libs/shared-models';
  
  export default function SupplierGrid() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(undefined);
    const service = new SupplierService();
  
    useEffect(() => {
      getData();
    }, []);
  
    function getData() {
      service.getAllSuppliers().then((res) => {
        if (res.data) {
          setData(res.data);
        }
      });
    }
  
    const updateSupplier = (supplier: supplierDto) => {
      const authdata = JSON.parse(localStorage.getItem(''));
  
      console.log(supplier.updatedUser);
      service.updateSuppliers(supplier).then((res) => {
        if (res.status) {
          message.success('Updated Succesfully');
          setDrawerVisible(false);
          getData();
        } else {
          message.error(res.internalMessage);
        }
      });
    };
  
    const deleteSupplier = (val: supplierReq) => {
      val.isActive = val.isActive ? false:true;
      service.activateOrDeactivateSupplier(val).then((res) => {
        if (res.status) {
          // console.log('okkkkkkkkkkk');
          message.success(res.internalMessage, 2);
          getData();
        } else {
          message.error(res.internalMessage);
        }
      });
    };
  
    // console.log(deletesupplier, '....................');
  
    const openFormWithData = (viewData: supplierDto) => {
      console.log(viewData);
      setDrawerVisible(true);
      setSelectedSupplier(viewData);
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
        title: 'Supplier Name',
        dataIndex: 'supplierName',
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
                  message.error('You Cannot Edit Deactivated Address');
                }
              }}
              style={{ color: '#1890ff', fontSize: '14px' }}
            />
  
            <Divider type="vertical" />
            <Popconfirm
              onConfirm={(e) => {
                deleteSupplier(rowData);
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
      navigate('/supplier-form');
    }
  
    return (
      <>
        <Card
          title="Categories"
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
              <SupplierForm
                key={Date.now()}
                updateDetails={updateSupplier}
                isUpdate={true}
                supplierData={selectedSupplier}
                closeForm={closeDrawer}
              />
            </Card>
          </Drawer>
        </Card>
      </>
    );
    return
  }
  