import {
    Button,
    Card,
    Col,
    Divider,
    Drawer,
    Input,
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
  import { useEffect, useRef, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import SupplierForm from './supplier-form';
import Highlighter from 'react-highlight-words';
import { SupplierService } from 'libs/shared-services';
import { supplierDto, supplierReq } from 'libs/shared-models';
  
  export default function SupplierGrid() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(undefined);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null); 
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
      setDrawerVisible(true);
      setSelectedSupplier(viewData);
    };
  
    const closeDrawer = () => {
      setDrawerVisible(false);
    };
  
    const getColumnSearchProps = (dataIndex: string) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            size="small"
            style={{ width: 90 }}
            onClick={() => {
              handleReset(clearFilters);
              setSearchedColumn(dataIndex);
              confirm({ closeDropdown: true });
            }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          type="search"
          style={{ color: filtered ? '#1890ff' : undefined }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : false,
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current.select());
        }
      },
      render: (text) =>
        text ? (
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#faf8f5', padding: 0 }}
              // '#e8e4df'
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
          )
        ) : null,
    });
    function handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    }
    
    function handleReset(clearFilters) {
      clearFilters();
      setSearchText('');
    }

    const columns: any = [
      {
        title: 'S.No',
        render: (val, record, index) => index + 1,
      },
      {
        title: 'Supplier Code',
        dataIndex: 'supplierCode',
        ...getColumnSearchProps('supplierCode')
      },
      {
        title: 'Supplier Name',
        dataIndex: 'supplierName',
        ...getColumnSearchProps('supplierName')
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
  