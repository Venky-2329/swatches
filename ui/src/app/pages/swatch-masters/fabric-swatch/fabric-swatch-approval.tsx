import React, { useEffect, useRef, useState } from 'react';
import {Alert,Button,Card,Checkbox,Col,DatePicker,Divider,Drawer,Form,Input,Row,Select,Table,Tabs,Tag,Tooltip,Upload,UploadFile,message, notification, Image, Popconfirm, Modal} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {SearchOutlined,SyncOutlined,EditOutlined, BarcodeOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import Highlighter from 'react-highlight-words';
import { DateReq, EmailModel, StatusEnum, SwatchStatus, } from 'libs/shared-models';
import { EmailService, FabricSwatchService } from 'libs/shared-services';
import imageCompression from 'browser-image-compression';
import { RcFile } from 'antd/es/upload';
import TextArea from 'antd/es/input/TextArea';


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
  const createUser = JSON.parse(localStorage.getItem('auth'));
  const userRole = createUser.role;
  const department = createUser.departmentId
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(undefined);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pageSize, setPageSize] = useState<number>(null);
  const mailService = new EmailService()
  const [ dataById, setDataById ] = useState<any[]>([])




  useEffect(() => {
    setActiveKey(tabName);
  }, [tabName]);

  const handleRemove = (file) => {
    const updatedFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(updatedFileList);
  };

  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 5, // Adjust the maximum size as needed
        // maxWidthOrHeight: 1920, // Adjust the maximum width or height as needed
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
      });
      return compressedFile;
    } catch (error) {
      throw error;
    }
  };

  const handleBeforeUpload = async (file) => {
    setUploading(true)
    if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
      notification.info({ message: 'Only png, jpeg, jpg files are allowed!' });
      return true;
    }

    try {
      const compressedImage = await compressImage(file);

      if (fileList.length == 3) {
        notification.info({
          message: 'You Cannot Upload More Than Three File At A Time',
        });
        return true;
      } else {
        setUploading(false)
        setFileList([...fileList, compressedImage]);
        return false;
      }
    } catch (error) {
      return true; // Returning true to prevent uploading if an error occurs
    }
  };

  const uploadFieldProps = {
    multiple: true,
    onRemove: handleRemove,
    beforeUpload: handleBeforeUpload,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList: fileList,
  };

  const onPreview = async (file: UploadFile) => {
    // let src = file.url as string;
    // if (!src) {
    //   src = await new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file.originFileObj as RcFile);
    //     reader.onload = () => resolve(reader.result as string);
    //   });
    // }
    // const image = new Image();
    // image.src = src;
    // const imgWindow = window.open(src);
    // imgWindow?.document.write(image.outerHTML);
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    } else {
      setUploading(false);
    }
  };

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

  const getSwatchDetails = (value) => {
    const req = new SwatchStatus(value.fabricSwatchId, undefined, undefined);
    service.getDataById(req).then((res) => {
      if (res.status) {
        setDataById(res.data);
      }
    });
  };

  const onFinish = () => {
    if (fileList.length > 0) {
      console.log(form.getFieldValue('remarks'))
      const req = new SwatchStatus(selectedData.fabricSwatchId,undefined,undefined,undefined,undefined,form.getFieldValue('remarks'))
      console.log(req,'pppppppppppppppppppppp')
      service.updateSentForApprovalStatus(req).then((res) => {
        if (res.status) {
          if (fileList.length > 0) {
            const formData = new FormData();
            fileList.forEach((file: any) => {
              formData.append('file', file);
            })
            formData.append('fabricSwatchId', `${res.data.fabricSwatchId}`)
            service.uploadPhoto(formData).then((fileres) => {
              if (res.status) {
                res.data.filePath = fileres.data;
                // sendMailForApprovalUser()
                message.success(res.internalMessage, 2);
                sendMailForApprovalUser()
                // onReset();
                setDrawerVisible(false)
                setModal(false)
                setFileList([])
                getData(tabName)
                getCount()
              } else {
                message.error(res.internalMessage, 2);
              }
            });
          }
        } else {
          message.info(res.internalMessage, 2);
        }
      });
    } else {
      return notification.info({ message: 'Please upload Swatch' });
    }
  };

  let mailerSent = false;
    async function sendMailForApprovalUser() {
        const swatchDetails = new EmailModel();
        swatchDetails.swatchNo = data[0]?.fabricSwatchNo
        swatchDetails.to = data[0]?.approverMail
        swatchDetails.html = `
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            #acceptDcLink {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #28a745;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 10px;
                  transition: background-color 0.3s ease, color 0.3s ease;
                  cursor: pointer;
              }
      
              #acceptDcLink.accepted {
                  background-color: #6c757d;
                  cursor: not-allowed;
              }
      
              #acceptDcLink:hover {
                  background-color: #218838;
                  color: #fff;
              }
          </style>
        </head>
        <body>
          <p>Dear team,</p>
          <p>Please find the Reworked 🔁 Fabric Swatch details below:</p>
          <p>Fabric Swatch No: ${selectedData?.fabricSwatchNo}</p>
          <p>Buyer: ${selectedData?.buyerName}</p>
          <p>Brand: ${selectedData?.brandName}</p>
          <p>Style No: ${selectedData?.styleNo}</p>
          <p>Item No: ${selectedData?.itemNo}</p>
          <p>Please click the link below for details:</p>

          <a
            href="http://dsw7.shahi.co.in/#/fabric-swatch-detail-view/${selectedData?.fabricSwatchId}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            "
            >View Details of ${selectedData?.fabricSwatchNo}</a
          >

        </body>
      </html>
      `
        swatchDetails.subject = "Fabric Swatch : " + selectedData?.fabricSwatchNo
        const res = await mailService.sendSwatchMail(swatchDetails)
        console.log(res)
        if (res.status == 201) {
            if (res.data.status) {
                message.success("Mail sent successfully")
                mailerSent = true;
            } else {
                message.success("Mail sent successfully")
            }
        } else {
            message.success(`Alert mail sent to the ${selectedData?.approverMail}`)
        }
    }

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
    setPage(1);
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

  const openFormWithData=(viewData)=>{
    // console.log(viewData,'oooooooooooooooooooooooooooooo')
    setDrawerVisible(true);
    setSelectedData(viewData);
    getSwatchDetails(viewData)
  }

  const closeDrawer=()=>{
    setDrawerVisible(false);
    setFileList([])
  }

  const columns: any = [
    {
      title: 'S.No',
      render: (text, object, index) => (page - 1) * pageSize + index + 1
    },
    {
      title:<div style={{textAlign:'center'}}>Swatch Number</div>,
      dataIndex: 'fabricSwatchNo',
      ...getColumnSearchProps('fabricSwatchNo'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title: <div style={{textAlign:'center'}}>Buyer</div>,
      dataIndex: 'buyerName',
      ...getColumnSearchProps('buyerName'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>Brand</div>,
      dataIndex: 'brandName',
      ...getColumnSearchProps('brandName'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>Supplier</div>,
      dataIndex: 'supplierName',
      ...getColumnSearchProps('supplierName'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>Category</div>,
      dataIndex: 'categoryName',
      ...getColumnSearchProps('categoryName'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>Season</div>,
      dataIndex: 'seasonName',
      ...getColumnSearchProps('fabricSwatchNo'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>Style No</div>,
      dataIndex: 'styleNo',
      ...getColumnSearchProps('fabricSwatchNo'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>Item No</div>,
      dataIndex: 'itemNo',
      ...getColumnSearchProps('fabricSwatchNo'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>Category Type</div>,
      dataIndex: 'categoryType',
      ...getColumnSearchProps('categoryType'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>PO No</div>,
      dataIndex: 'poNumber',
      ...getColumnSearchProps('poNumber'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>GRN No</div>,
      dataIndex: 'grnNumber',
      ...getColumnSearchProps('grnNumber'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>GRN Date</div>,
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
      title:<div style={{textAlign:'center'}}>Item Description</div>,
      dataIndex: 'itemDescription',
      ...getColumnSearchProps('itemDescription'),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title:<div style={{textAlign:'center'}}>Reworked</div>,
      dataIndex: 'rework',
      render: (text) => {
        return text || '-';
      },
      onFilter: (value, record) => {
        return record.rework.includes(value);
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown" style={{ flexDirection: 'row', marginLeft: 10 }}>
          <Checkbox
            checked={selectedKeys.includes('YES')}
            onChange={() => setSelectedKeys(selectedKeys.includes('YES') ? [] : ['YES'])}
          >
            <span style={{ color: 'green' }}>YES</span>
          </Checkbox>
          <Checkbox
            checked={selectedKeys.includes('NO')}
            onChange={() => setSelectedKeys(selectedKeys.includes('NO') ? [] : ['NO'])}
          >
            <span style={{ color: 'red' }}>NO</span>
          </Checkbox>
          <div className="custom-filter-dropdown-btns">
            <Button onClick={() => clearFilters()} className="custom-reset-button">
              Reset
            </Button>
            <Button type="primary" style={{ margin: 10 }} onClick={() => confirm()} className="custom-ok-button">
              OK
            </Button>
          </div>
        </div>
      ),
    },
    {
      title:<div style={{textAlign:'center'}}>Remarks</div>,
      dataIndex: `${tabName === 'REWORK' ? 'reworkRemarks' : tabName === 'APPROVED' ? 'approvalRemarks' : tabName === 'REJECTED' ? 'rejectionReason':tabName === 'SENT_FOR_APPROVAL'? 'remarks': '-'}`,
      ...getColumnSearchProps( `${tabName === 'REWORK' ? 'reworkRemarks' : tabName === 'APPROVED' ? 'approvalRemarks' : tabName === 'REJECTED' ? 'rejectionReason':tabName === 'SENT_FOR_APPROVAL'? 'remarks': '-'}`),
      render: (text) => {
        return text || '-';
      }
    },
    {
      title: <div style={{textAlign:"center"}}>Action</div>,
      dataIndex: 'action',
      align:'center',
      render: (text, rowData) => {
        return(
          <span>
            <Tooltip placement="top" title="Detail View">
              <EyeOutlined
               onClick={() => {
                navigate(`/fabric-swatch-detail-view/${rowData.fabricSwatchId}`)
              }}
              style={{ color: "blue", fontSize: 20 }}
              />
            </Tooltip>
          </span>
        )
    },
    },
    {
      title: <div style={{textAlign:"center"}}>Action</div>,
      dataIndex: 'edit',
      align:'center',
      render: (text, rowData) => {
        return(
          <span>
                    <Tooltip placement="top" title="Edit">
                    <EditOutlined  className={'editSampleTypeIcon'}  type="edit" 
                        onClick={() => openFormWithData(rowData)}
                        style={{ color: '#1890ff', fontSize: '14px' }}
                      />
                    </Tooltip>
          </span>
        )
    },
    },
  ]

  const onReset = () => {
    form.resetFields();
    setFileList([])
  };

  const handleDeleteImage = (value)=>{
    console.log(value.uploadId,'-----------------')
    const req = new SwatchStatus(value.uploadId,undefined)
    service.deleteImage(req).then((res)=>{
      if(res.status){
        message.success(res.internalMessage,2)
        // getSwatchDetails(value.fabricSwatchId)
      }else{
        message.error(res.internalMessage,2)
      }
    })
  }

  const tabData = [
    { key: StatusEnum.SENT_FOR_APPROVAL, label: "WAITING FOR APPROVAL", color: "#d4b417", countKey: "waitingCount", excludeColumns: ['rejectionReason', 'poNumber', 'grnNumber', 'grnDate', 'itemDescription', 'edit'] },
    { key: StatusEnum.APPROVED, label: "APPROVED", color: "green", countKey: "approvedCount", excludeColumns: ['rejectionReason', 'poNumber', 'grnNumber', 'grnDate', 'itemDescription','edit'] },
    { key: StatusEnum.REJECTED, label: "REJECTED", color: "red", countKey: "rejectedCount", excludeColumns: ['poNumber', 'grnNumber', 'grnDate', 'itemDescription','edit'] },
    { key: StatusEnum.REWORK, label: "REWORK", color: "orange", countKey: "reworkCount", excludeColumns: [''] }
  ];  

  // const imageUrls = dataById.map(item => `http://dsw7.shahi.co.in/services/kanban-service/upload-files/${item?.fileName}`);

  const onSubmit = () =>{
    if(fileList.length > 0){
    setModal(true)
    }else{
      notification.info({ message: 'Please upload at least one Image' })
    }
  }

  return (
    <Card
      title={<span>Fabric Approval</span>}
      style={{ textAlign: 'left' }}
      headStyle={{ backgroundColor: '#25529a', color: 'white' }}
      extra={
        (userRole === 'ADMIN' || (department === 2 && userRole === 'STORES')) && (
          <Link to="/fabric-swatch-upload">
            <span style={{ color: 'white' }}>
              <Button>Create</Button>
            </span>
          </Link>
        )
      }            
      >
        <Tabs onChange={tabsOnchange} activeKey={activeKey}>
        {tabData.map(tab => (
          <TabPane key={tab.key} tab={<span style={{ color: tab.color }}>{tab.label}: {countData[0]?.[tab.countKey]}</span>}>
            {data.length > 0 ? (
              <Table
              pagination={{
                pageSize: 20, 
                onChange(current, pageSize) {
                    setPage(current);
                    setPageSize(pageSize);
                }
              }}
                scroll={{ x: 'max-content' }}
                columns={columns.filter(o => !tab.excludeColumns.includes(o.dataIndex))}
                dataSource={data}
                size="small"
                bordered
              />
            ) : (
              <Alert message="No data available☹️" type="info" showIcon style={{ width: "160px", margin: "auto" }} />
            )}
          </TabPane>
        ))}
      </Tabs>
      <Drawer bodyStyle={{ paddingBottom: 80 }} title={selectedData?.fabricSwatchNo} width={window.innerWidth > 768 ? '50%' : '85%'}
        onClose={closeDrawer} visible={drawerVisible} closable={true}>
        <Card>  
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 18 }} lg={{ span: 15 }} xl={{ span: 4 }}>
                  <Form.Item label={'Fabric Image'} required={true}>
                    <Upload
                    {...uploadFieldProps}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={onPreview}
                    style={{ width: '200px', height: '200px' }}
                    accept=".png,.jpeg,.PNG,.jpg,.JPG"
                    onChange={handleChange}
                    >
                      {uploading ? <SyncOutlined spin /> : (fileList.length < 3 && '+ Upload')}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={{span:24}} sm={{span:24}} md={{span:6}} lg={{span:6}} xl={{span:6}}>
                <Form.Item
                      label="Remarks"
                      name={'remarks'}
                      rules={[{ required: true, message: 'Please input Remarks' }]}
                    >
                      <TextArea rows={4} placeholder="Enter Remarks" />
                    </Form.Item>
                </Col>
                </Row>

                <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={onSubmit}>
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
              </Form>
        </Card>
        <Modal
          title="Image Previews"
          visible={modal}
          onCancel={() => setModal(false)}
          footer={[
            // Submit button inside modal footer
            <Button key="submit" type="primary" onClick={onFinish}>
              Submit
            </Button>
            ]}
        >
        <Image.PreviewGroup>
          {dataById.map((item, index) => (
            <div key={index} style={{ position: 'relative', marginRight: '10px', display: 'inline-block' }}>
              <div style={{ position: 'relative' }}>
                <Image
                  src={`http://dsw7.shahi.co.in/services/kanban-service/upload-files/${item?.fileName}`}
                  alt={`Preview`}
                  height={'100px'}
                  width={'280px'}
                  style={{
                    width: '100%',
                    objectFit: 'contain',
                  }}
                />
                <Popconfirm
              title="Are you sure to delete this image?"
              onConfirm={() => handleDeleteImage(item)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              />
            </Popconfirm>
              </div>
            </div>
          ))}
        </Image.PreviewGroup>
        </Modal>
        </Drawer>
    </Card>
  );
};

export default FabricSwatchApproval;
