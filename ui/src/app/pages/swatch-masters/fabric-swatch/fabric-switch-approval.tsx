import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tabs,
  message,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  SearchOutlined,
  UndoOutlined,
  FileExcelOutlined,
  BarcodeOutlined,
  SendOutlined,
} from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
// import './visitor-report.css';
import Highlighter from 'react-highlight-words';
import { StatusEnum } from 'libs/shared-models';
import { FabricSwatchService } from 'libs/shared-services';

const FabricSwatchApproval = () => {
  const { Option } = Select;
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  // const service = new VisitorService();
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [tabName, setTabName] = useState<string>('OPEN');
  const [selectedTabKey, setSelectedTabKey] = useState('1');
  const [countData, setCountData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [modal, setModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState('');
  const fabricService = new FabricSwatchService();
  const [tagData, setTagData] = useState<any[]>([]);
  const [action, setAction] = useState(null);
  const [formData, setFormData] = useState({});
  const [barcodeModal, setBarcodeModal] = useState('');
  const [activeKey, setActiveKey] = useState('OPEN');

  useEffect(() => {
    setActiveKey(tabName);
  }, [tabName]);

  useEffect(() => {
    // getData(tabName);
    getCount();
    // getTags()
  }, []);

  // const getData = (value: any) => {
  //   const req = new DateReq(value, undefined, undefined);
  //   if (form.getFieldValue('fromDate') !== undefined) {
  //     req.fromDate = form.getFieldValue('fromDate')[0].format('YYYY-MM-DD');
  //   }
  //   if (form.getFieldValue('fromDate') !== undefined) {
  //     req.toDate = form.getFieldValue('fromDate')[1].format('YYYY-MM-DD');
  //   }
  //   service.getVisitors(req).then((res) => {
  //     if (res.status) {
  //       setData(res.data);
  //       message.success(res.internalMessage, 2);
  //     } else {
  //       setData([]);
  //       message.error(res.internalMessage, 2);
  //     }
  //   });
  // };

  // const getTags = ()=>{
  //   tagService.getAllActiveTag().then((res)=>{
  //       if(res.status){
  //           setTagData(res.data)
  //       }
  //   })
  // }

  const getCount = () => {
    fabricService.statusCount().then((res) => {
      if (res.status) {
        setCountData(res.data);
      }
    });
  };

  // const tabsOnchange = (value: any) => {
  //   setTabName(value);
  //   getData(value);
  // };

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

  // const selectedTabData = data.filter((item) => {
  //   if (selectedTabKey === '1') {
  //     return item.status === VisitorStatusEnum.OPEN;
  //   } else if (selectedTabKey === '2') {
  //     return item.status === VisitorStatusEnum.ACCEPTED;
  //   } else if (selectedTabKey === '3') {
  //     return item.status === VisitorStatusEnum.REJECTED;
  //   }
  //   return true;
  // });

  // const handleFormSubmit = () => {
  //   if (action === 'accept') {
  //     visitorAccepted(formData);
  //   } else if (action === 'reject') {
  //     visitorRejected(formData);
  //   }
  // };

  // const visitorAccepted = (value)=>{
  //   const req = new VisitorStatus(value,form.getFieldValue('tagNumber'))
  //   service.updateApprovedStatus(req).then((res)=>{
  //       if(res.status){
  //           message.success(res.internalMessage,2)
  //           setTabName('ACCEPTED')
  //           setActiveKey('ACCEPTED');
  //           getData('ACCEPTED')
  //           getCount()
  //           setModal(false)
  //           onReset()
  //       }else{
  //           message.error(res.internalMessage,2)
  //       }
  //   })
  // }

  // const visitorRejected =(value)=>{
  //   const req = new VisitorStatus(value,undefined,form.getFieldValue('rejectionReason'))
  //   service.updateRejectedStatus(req).then((res)=>{
  //       if(res.status){
  //           message.success(res.internalMessage,2)
  //           setTabName('REJECTED')
  //           setActiveKey('REJECTED');
  //           getData('REJECTED')
  //           getCount()
  //           setModal(false)
  //           onReset()
  //       }else{
  //           message.error(res.internalMessage,2)
  //       }
  //   })
  // }

  const handleAccept = (value) => {
    setAction('accept');
    setModal(true);
    setFormData(value.visitor_id);
  };

  const handelReject = (value) => {
    setAction('reject');
    setFormData(value.visitor_id);
    setModal(true);
  };

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
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    // }
  ];

  const onReset = () => {
    form.resetFields();
    // getData(tabName);
  };

  const columnColor = (record: any) => {
    return record.check_out_status === 'OPEN' ? 'open' : '';
  };

  const onBarcodeModalCancel = () => {
    onReset();
    setBarcodeModal(null);
    setModal(false);
  };

  const barScannerData = (value) => {
    setBarcodeModal(null);
    form.setFieldsValue({ tagNumber: value });
  };

  return (
    <Card
      title={<span>Visitor Approval</span>}
      style={{ textAlign: 'left' }}
      headStyle={{ backgroundColor: '#25529a', border: 0, color: 'white' }}
    >
      <Tabs
        // onChange={tabsOnchange}
        activeKey={activeKey}
      >
        <TabPane
          key={StatusEnum.OPEN}
          tab={`OPEN : ${countData[0]?.openCount}`}
        >
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            scroll={{ x: true }}
            columns={columns.filter(
              (o) =>
                ![
                  'visitor_check_in',
                  'visitor_check_out',
                  'check_out_status',
                  'duration',
                  'rejection_reason',
                  'v_card',
                ].includes(o.dataIndex)
            )}
            dataSource={data}
            size="small"
          ></Table>
        </TabPane>
        <TabPane
          key={StatusEnum.APPROVED}
          tab={`APPROVED : ${countData[0]?.approvedCount}`}
        >
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            rowClassName={columnColor}
            scroll={{ x: 'max-content' }}
            columns={columns.filter(
              (o) => !['rejection_reason', 'action'].includes(o.dataIndex)
            )}
            dataSource={data}
            size="small"
          ></Table>
        </TabPane>
        <TabPane
          key={StatusEnum.REJECTED}
          tab={`REJECTED : ${countData[0]?.rejectedCount}`}
        >
          <Table
            pagination={{
              onChange(current) {
                setPage(current);
              },
            }}
            scroll={{ x: true }}
            columns={columns.filter(
              (o) =>
                ![
                  'visitor_check_in',
                  'visitor_check_out',
                  'check_out_status',
                  'duration',
                  'v_card',
                  'action',
                ].includes(o.dataIndex)
            )}
            dataSource={data}
            size="small"
          ></Table>
        </TabPane>
      </Tabs>
      <Modal
        visible={modal}
        onCancel={onBarcodeModalCancel}
        footer={null}
        style={{ maxWidth: '100%' }}
        destroyOnClose
      >
        <Card
          title={action === 'accept' ? 'Accept' : 'Reject'}
          size="small"
          headStyle={{
            backgroundColor: '#69c0ff',
            border: 0,
            textAlign: 'center',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            // onFinish={handleFormSubmit}
          >
            {action === 'accept' ? (
              <Row gutter={16}>
                <Col>
                  <Form.Item name="tagNumber" label="Tag" required={true}>
                    <Select
                      suffixIcon={
                        <BarcodeOutlined
                          onClick={(e) => {
                            setBarcodeModal('visitorCode');
                          }}
                        />
                      }
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      placeholder={
                        <div style={{ textAlign: 'center' }}>Select Tag</div>
                      }
                      style={{ width: '150px' }}
                    >
                      {tagData.map((e) => (
                        <Option key={e.tagId} value={e.tagNumber}>
                          {e.tagNumber}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* {barcodeModal === 'visitorCode' ? <BarcodeScanner handleScan={barScannerData}/>: null} */}
              </Row>
            ) : null}
            {action === 'reject' && (
              <Row gutter={16}>
                <Col>
                  <Form.Item
                    name="rejectionReason"
                    label="Reason"
                    required={true}
                  >
                    <Input placeholder="Enter Reason" />
                  </Form.Item>
                </Col>
              </Row>
            )}
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
        </Card>
      </Modal>
    </Card>
  );
};

export default FabricSwatchApproval;
