import { Button, Card, Col, DatePicker, Form, Row, Select, Table, message } from 'antd';
import { TrimSwatchService } from 'libs/shared-services';
import { title } from 'process';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload } from "react-icons/fa6";
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import { DateReq, ReportReq, StatusDisplayEnum, StatusEnum } from 'libs/shared-models';


export const TrimSwatchGrid = () => {
  const Option = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [approvedBy, setApprovedBy] = useState([]);
  const [createdBy, setCreatedBy] = useState([]);
  const [status, setStatus] = useState([]);
  const [trimNumber, setTrimNumber] = useState([]);
  const [countData, setCountData] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState([dayjs(), dayjs()]);
  const [responseData, setResponseData] = useState<any>([]);
  const service = new TrimSwatchService();
  const { RangePicker } = DatePicker  ;
  // const [selectedFromDate, setSelectedFromDate] = useState(undefined);
  // const [selectedToDate, setSelectedToDate] = useState(undefined);
  // const [initialDate, setInitialDate] = useState([dayjs(), dayjs()]);



  useEffect(() => {
    // getAllData();
    getApprovedBy();
    getCreatedBy();
    getStatus();
    getTrimNumber();
  }, []);

  const getAllData = () => {
    const req = new ReportReq();
    req.swatchNumber = form.getFieldValue('trimSwatchNumber')
    req.fromDate = form.getFieldValue('date')[0].format('YYYY-MM-DD');
    req.toDate = form.getFieldValue('date')[1].format('YYYY-MM-DD');
    req.approverId = form.getFieldValue('approverId')
    req.createdUser = form.getFieldValue('createdUser')
    req.status = form.getFieldValue('status')

    service.getReport(req).then((res) => {
      if (res.status) {
        setData(res.data);
        message.success(res.internalMessage,2);
      } else {
        setData([]);
        message.error(res.internalMessage,2);
      }
    });
  };

  const getApprovedBy = () => {
    service.getApprovedBy().then((res) => {
      if (res.status){
        setApprovedBy(res.data);
      }
    })
  }

  const getCreatedBy = () => {
    service.getCreatedBy().then((res) => {
      if (res.status){
        setCreatedBy(res.data);
      }
    })
  }

  const getStatus = () => {
    service.getStatus().then((res) => {
      if (res.status){
        setStatus(res.data);
      }
    })
  }

  const getTrimNumber = () => {
    service.getSwatchNo().then((res) => {
      if (res.status){
        setTrimNumber(res.data);
      }
    })
  }

  const onReset = () => {
    form.resetFields();
  }

  // const getReport = ( ) =>  {
  //   const req = new ReportReq();
  //   req.swatchId = form.getFieldValue('trim_swatch_number')
  //   req.fromDate = 
  // }

  const columns: any = [
    {
      title: 'S.No',
      render: (val, record, index) => index + 1,
    },
    {
      title: 'Trim Number',
      dataIndex: 'trim_swatch_number',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (createdAt) => {
        const date = new Date(createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
    {
      title: 'GRN Number',
      dataIndex: 'grn_number',
    },
    {
      title: 'GRN Date',
      dataIndex: 'grn_date',
      render: (grnDate) => {
        const date = new Date(grnDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
    {
      title: 'Buyer',
      dataIndex: 'buyerName',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
    },
    {
      title: 'Po No',
      dataIndex: 'po_number',
    },
    {
      title: 'Style No',
      dataIndex: 'style_no',
    },
    {
      title: 'Item No',
      dataIndex: 'item_no',
    },
    {
      title: 'Item Descrpition',
      dataIndex: 'item_description',
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Approved By',
      dataIndex: 'employeeName',
    },
    {
      title: 'Approved Date',
      dataIndex: 'updatedAt',
      render: (updatedAt) => {
        const date = new Date(updatedAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
    {
      title: 'Created By',
      dataIndex: 'createdUser',
    },
  ];

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet('Trim Swatch')
      .addColumns(columns)
      .addDataSource(data,{str2num:true})
      .saveAs('trim-swatch-report.xlsx');
  }

  // const PickDate = (value) => {
  //   if (value) {
  //     const fromDate = (dayjs(value[0]).format('YYYY-MM-DD'));
  //     const toDate = (dayjs(value[1]).format('YYYY-MM-DD'));
  //     setSelectedFromDate(fromDate)
  //     setSelectedToDate(toDate)
  //   }
  // }


  return (
    <>
      <Card
        title="Trim Swatch"
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        // extra={
        //   <span style={{ color: 'Green' }} >
        //   <Button onClick={exportExcel} icon={<FaDownload />}>Excel</Button>{' '}
        //   </span>
        // }
      >
        <Form form={form} layout="vertical" >
          <Row gutter={24}>
            <Col xs={24} sm={24} md={{span: 6}} lg={{span: 4 }} xl={{span: 5 }}>
              <Form.Item name={'trimSwatchNumber'} label={'Trim No'}>
                <Select allowClear  placeholder="Select Trim No"  mode="multiple" >
                  {trimNumber.map((item) => {
                    return (
                      <Option
                        key={item.trimSwatchId}
                        value={item.trimSwatchNumber}
                      >
                        {item.trimSwatchNumber}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24}md={{span: 6}} lg={{span: 4  }} xl={{span: 5 }}>
            <Form.Item name="date" label=" Date" initialValue={initialDate}>
                <RangePicker  />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}md={{span: 6}} lg={{span: 4  }} xl={{span: 4 }}>
            <Form.Item name="approverId" label="Approved By" >
              <Select allowClear placeholder='Select Approved By'>
                {approvedBy.map((item) => {
                  return (
                    <Option key={item.approvedId} value={item.approvedId} >{item.employeeName} </Option>
                  )
                })}
                </Select>    
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}md={{span: 6}} lg={{span: 4  }} xl={{span: 4 }}>
            <Form.Item name="createdUser" label="Created By" >
              <Select allowClear placeholder='Select Created By'>
                {createdBy.map((item) => {
                  return (
                    <Option key={item.createdUser} value={item.createdUser} >{item.createdUser} </Option>
                  )
                })}
                </Select>    
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}md={{span: 6}} lg={{span: 4  }} xl={{span: 4 }}>
            <Form.Item name="status" label="Status" >
              <Select allowClear placeholder='Select Status'>
              {Object.values(StatusDisplayEnum).map((val) => (
                <Select.Option key={val.name} value={val.name}>
                  {val.displayVal}
                </Select.Option>
              ))}
                </Select>    
              </Form.Item>
            </Col>

          </Row>
          <Row justify={'end'} gutter={24}>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                <Button onClick={getAllData} type='primary'>Submit</Button>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                <Button onClick={onReset}>Reset</Button>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 2 }}>
                <Button onClick={exportExcel} icon={<FaDownload />} style={{color: 'green' , backgroundColor:'lightgreen'}}>Excel</Button>
              </Col>
          </Row>
        </Form>
        {data.length > 0 ?(<Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          bordered
        />):(<></>)}
      </Card>
    </>
  );
};
