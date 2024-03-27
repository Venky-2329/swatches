import React, { useEffect, useRef, useState } from 'react';
import {Alert,Button,Card,Col,DatePicker,Divider,Drawer,Form,Input,Modal,Popconfirm,Row,Segmented,Select,Table,Tabs,Tag,Tooltip,message} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {SearchOutlined,UndoOutlined,FileImageOutlined, BarcodeOutlined, EyeOutlined} from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import Highlighter from 'react-highlight-words';
import { DateReq, StatusEnum, } from 'libs/shared-models';
import { FabricSwatchService } from 'libs/shared-services';


const FabricSwatchApproval = () => {
  let navigate = useNavigate();
  const { Option } = Select
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [tabName, setTabName] = useState<string>('SENT_FOR_APPROVAL');
  const [selectedTabKey, setSelectedTabKey] = useState('1');
  const [countData, setCountData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [modal, setModal] = useState<boolean>(false);
  const fabricService = new FabricSwatchService()
  const [barcodeModal, setBarcodeModal] = useState('');
  const service = new FabricSwatchService()
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('SENT_FOR_APPROVAL');


  useEffect(() => {
    setActiveKey(tabName);
  }, [tabName]);

  useEffect(() => {
    const tabKey = location.state?.tab;
    if (tabKey) {
      setActiveKey(tabKey);
      getData(tabKey);
    }
  }, [location.state]);

  useEffect(() => {
    getData(tabName);
    getCount();
  }, []);

  
  const getData = (value: any) => {
    const req = new DateReq(value, undefined, undefined);
    if (form.getFieldValue('fromDate') !== undefined) {
      req.fromDate = form.getFieldValue('fromDate')[0].format('YYYY-MM-DD');
    }
    if (form.getFieldValue('fromDate') !== undefined) {
      req.toDate = form.getFieldValue('fromDate')[1].format('YYYY-MM-DD');
    }
    service.getAllFabricSwatchData(req).then((res) => {
      if (res.status) {
        setData(res.data);
        message.success(res.internalMessage, 2);
      } else {
        setData([]);
        message.error(res.internalMessage, 2);
      }
    });
  };

  const getCount = () => {
    fabricService.statusCount().then((res) => {
      if (res.status) {
        setCountData(res.data);
      }
    });
  };

  const tabsOnchange = (value: any) => {
    setSelectedTabKey(value);
    setTabName(value);
    getData(value);
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
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
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
      title:'Rejection Reason',
      dataIndex: 'rejectionReason'
    },
    {
      title: <div style={{textAlign:"center"}}>Action</div>,
      dataIndex: 'action',
      render: (text, rowData) => {
        return(
          <span>
                    <Tooltip placement="top" title="Detail View">
                        <EyeOutlined
                            onClick={() => {
                                console.log(rowData.fabricSwatchId);
                                navigate(`/fabric-swatch-detail-view/${rowData.fabricSwatchId}`)
                            }}
                            style={{ color: "blue", fontSize: 20 }}
                        />
                        <Divider type='vertical' />
                    </Tooltip>
          </span>
        // <div style={{ textAlign: 'center' }}>
        //     <Popconfirm
        //       title="Are you sure to accept?"
        //       onConfirm={() => fabricAccepted(rowData)}
        //       okText="Yes"
        //       cancelText="No"
        //     >
        //       <Tooltip title="Approve"><Button >✔️</Button></Tooltip>
        //     </Popconfirm>
        //     <Divider type='vertical'/>
        //     <Tooltip title="Reject"><Button  onClick={() => handelReject(rowData)}>❌</Button></Tooltip>
        // </div>
        )
    },
    },
  ]

  const onReset = () => {
    form.resetFields();
  };

  const columnColor = (record: any) => {
    return record.check_out_status === 'OPEN' ? 'open' : '';
  };

  const onModalCancel = () => {
    onReset()
    setBarcodeModal(null)
    setModal(false);
  };

  return (
    <Card
      title={<span>Fabric Approval</span>}
      style={{ textAlign: 'left' }}
      headStyle={{ backgroundColor: '#25529a', color: 'white' }}
      >
      <Tabs 
      onChange={tabsOnchange} 
      activeKey={activeKey}
      >
        <TabPane
          key={StatusEnum.SENT_FOR_APPROVAL}
          tab={<span style={{color:'#d4b417'}}>WAITING FOR APPROVAL : {countData[0]?.waitingCount}</span>}
        >
          {data.length > 0 ?(
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            scroll={{ x: true }}
            columns={columns.filter(
                (o) => !['rejectionReason','poNumber','grnNumber','grnDate','itemDescription','mill',].includes(o.dataIndex)
              )}
            dataSource={data}
            size="small"
            bordered
          />):(
            <Alert 
            message="No data available☹️" 
            type="info" 
            showIcon
            style={{ width: "160px", margin: "auto" }}/>
          )}
        </TabPane>
        <TabPane
          key={StatusEnum.APPROVED}
          tab={<span style={{ color: 'green' }}>APPROVED : {countData[0]?.approvedCount}</span>}
          >
          {data.length  > 0 ?(<Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            rowClassName={columnColor}
            scroll={{ x: 'max-content' }}
            columns={columns.filter(
                (o) => !['rejectionReason','action'].includes(o.dataIndex)
              )}
            dataSource={data}
            size="small"
            bordered
          />):( 
            <Alert
            message="No data available☹️" 
            type="info" 
            showIcon
            style={{ width: "160px", margin: "auto" }}/>
          )}
        </TabPane>
        <TabPane
          key={StatusEnum.REJECTED}
          tab={<span style={{ color: 'red'}}>REJECTED : {countData[0]?.rejectedCount}</span>}
        >
          {data.length > 0 ?(<Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            scroll={{ x: true }}
            columns={columns.filter(
              (o) => !['action'].includes(o.dataIndex)
            )}
            dataSource={data}
            size="small"
            bordered
          />): (
            <Alert
            message="No data available☹️" 
            type="info" 
            showIcon
            style={{ width: "160px", margin: "auto" }}
            />
          )}
        </TabPane>
      </Tabs>
      {/* <Modal
        visible={modal}
        onCancel={onModalCancel}
        footer={null}
        style={{ maxWidth: '90%' }}
        destroyOnClose
        >
          {action === 'image' ? (
            <img src={imagePath} alt="Fabric Image" style={{ maxWidth: '100%' }} />
          ):null}

        {action === 'reject' ? (<Card
            title={'Reject'}
            size='small'
            headStyle={{ backgroundColor: '#25529a', color: 'white' }}
            >
            <Form form={form} layout='vertical' 
            onFinish={handleFormSubmit}
            >
                <Row gutter={16}>
                <Col xl={12} lg={12} xs={10}>
                    <Form.Item name='rejectionReason' label='Reason' rules={[{ required: true, message: 'Reason is required' }]}>
                    <TextArea rows={2} placeholder='Enter Reason' />
                    </Form.Item>
                </Col>
                </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  htmlType="button"
                  style={{ margin: '0 14px' }}
                  onClick={onReset}
                >
                  Reset
                </Button>
              </Col>
            </Row>
            </Form>
        </Card>): null}
        </Modal> */}
    </Card>
  );
};

export default FabricSwatchApproval;
