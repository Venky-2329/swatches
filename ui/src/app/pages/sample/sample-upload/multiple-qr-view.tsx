import { Button, Card, Col, Form, Row, Select, Table } from "antd"
import { useEffect, useState } from "react";
import { createSample, getAllSamplesData, getBrandsData, getCategoryData, getLocationData, getSeasonData, uploadPhoto } from "libs/shared-services";
import { QrcodeCoulmnsReq, SampleCardReq } from "libs/shared-models";
import QrCodesPrint from "./qr-code-print";
import {PrinterOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

export default function DigitalSamplesView(){
    const Option = Select
    const [form] = Form.useForm()
    const [brands,setBrands] = useState([]);
    const [category,setCategory] = useState([]);
    const [location,setLocation] = useState([]);
    const [seasons,setSeasons] = useState([]);
    const [filters,setFilters] = useState([]);
    const [gridData ,setGridData] = useState([]);
    const [selectedRowKeysData, setSelectedRowKeysData] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [showQrcode, setShowQrcode] = useState<boolean>(false);
    const [Qrcode, setQrcode] = useState<any[]>([]);
    const createUser: any = JSON.parse(localStorage.getItem('auth'))
    const navigate = useNavigate();

    useEffect(()=>{
        getBrands();
        getCategories();
        getLocations();
        getSeason();
        filtersData();
        getAllGridData();
      },[])

      function filtersData(){
        getAllSamplesData().then((res) => {
          if (res.data) {
            setFilters(res.data);
            // notification.success({ message: res.internalMessage });
          } else {
            // notification.error({ message: res.internalMessage });
          }
        });
      }

      function getAllGridData(){
        const req = new SampleCardReq();
    if(form.getFieldValue('brandId') != undefined){
      req.brandId = form.getFieldValue('brandId')
    }
    if(form.getFieldValue('itemNo') != undefined){
      req.itemNo = form.getFieldValue('itemNo')
    }
    if(form.getFieldValue('styleNo') != undefined){
      req.styleNo = form.getFieldValue('styleNo')
    }
    if(form.getFieldValue('categoryId') != undefined){
      req.categoryId = form.getFieldValue('categoryId')
    }
    if(form.getFieldValue('seasonId') != undefined){
      req.seasonId = form.getFieldValue('seasonId')
    }
    if(form.getFieldValue('locationId') != undefined){
      req.locationId = form.getFieldValue('locationId')
    }
        getAllSamplesData(req).then((res) => {
            if (res.data) {
                setGridData(res.data);
              // notification.success({ message: res.internalMessage });
            } else {
              // notification.error({ message: res.internalMessage });
            }
          });
      }
  
      function getBrands(){
        getBrandsData().then((res)=>{
            if(res.data){
              setBrands(res.data)
            }
        })
      }
  
      function getCategories(){
        getCategoryData().then((res)=>{
            if(res.data){
              setCategory(res.data)
            }
        })
      }
  
      function getLocations(){
        getLocationData().then((res)=>{
            if(res.data){
              setLocation(res.data)
            }
        })
      }
  
      function getSeason(){
        getSeasonData().then((res)=>{
            if(res.data){
              setSeasons(res.data)
            }
        })
      }
  
      function onReset() {
          form.resetFields();
          getAllGridData();
        }

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeysData(selectedRowKeys);
              setSelectedRows(selectedRows);
              setVisible(true);
            },
            getCheckboxProps: (record) => ({
              disabled: record.name === 'Disabled User',
              // Column configuration not to be checked
              name: record.name,
            }),
            selectedRowKeys: selectedRowKeysData
          }; 
          
          const closeWindow = () => { 
            setQrcode([]);
            window.close();
          };

          const generateQrcode = (records) => {
            const qrCodes = []
        
            for(const defRec of records){
              // defRec.qrCode = [`Operation : ${defRec.operationName}, Defect : ${defRec.defectName}`]
              defRec.qrCode = [`Sample Id : ${defRec.sampleId}`]
              qrCodes.push(defRec)
            }
            setQrcode(qrCodes)
            setShowQrcode(true)
            setSelectedRows(selectedRows)
          }

          const qrcodeWithColumns: QrcodeCoulmnsReq[] = [
            // { lineNumber: 0, title: 'Item', dataIndex: 'itemNo', span: 4, showLabel: true, showQrcode: false },
            { lineNumber: 1, title: 'Brand', dataIndex: 'brandName', span: 4, showLabel: true, showQrcode: false },
            { lineNumber: 2, title: 'Style', dataIndex: 'styleNo', span: 4, showLabel: true, showQrcode: false },
            // { lineNumber: 3, title: 'Location', dataIndex: 'locationName', span: 4, showLabel: true, showQrcode: false },
            { lineNumber: 4, title: '', dataIndex: 'qrCode', span: 4, showLabel: true, showQrcode: true },
          ];      

    const columns=[
        {
            title:'S.No',
            render:(val,record,index)=> index + 1
        },
        {
            title:'Item No',
            dataIndex:'itemNo'
        },
        {
            title:'Brand Name',
            dataIndex:'brandName'
        },
        {
            title:'Style No',
            dataIndex:'styleNo'
        },
        {
          title:'Quantity',
          dataIndex:'quantity'
        },
        {
            title :'Category',
            dataIndex:'categoryName'
        },
        {
          title:'Season',
          dataIndex:'seasonName'
        },
        {
          title:'Location',
          dataIndex:'locationName'
        },
        {
          title:'Qty/Season',
          dataIndex:'qtyPerSeason'
        },
    ];

    function gotoForm(){
        navigate('/sample-upload')
    }

    return(
        <>
        <Card title='View' extra={<span><Button type="primary" onClick={gotoForm}>Add</Button></span>}>
        <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}
          >
            <Form.Item label="Brand" name={'brandId'}>
              <Select showSearch  optionFilterProp="children" placeholder="Select Brand">
                {brands.map((item) => {
                  return <Option value={item.brandId}>{item.brandName}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}
          >
            <Form.Item label="Item No" name={'itemNo'}>
              <Select showSearch  optionFilterProp="children" placeholder="Select Item No">
                {filters.map((item) => {
                  return (
                    <Option value={item.itemNo}>{item.itemNo}</Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}
          >
            <Form.Item label="Style No" name={'styleNo'}>
              <Select showSearch  optionFilterProp="children" placeholder="Select Style">
                {filters.map((item) => {
                  return (
                    <Option value={item.styleNo}>{item.styleNo}</Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}
          >
            <Form.Item label="Category" name={'categoryId'}>
              <Select showSearch  optionFilterProp="children" placeholder="Select Category">
                {category.map((item) => {
                  return (
                    <Option value={item.categoryId}>{item.categoryName}</Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}
          >
            <Form.Item label="Season" name={'seasonId'}>
              <Select showSearch  optionFilterProp="children" placeholder="Select season">
                {seasons.map((item) => {
                  return (
                    <Option value={item.seasonId}>{item.seasonName}</Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}
          >
            <Form.Item label="Location" name={'locationId'}>
              <Select showSearch  optionFilterProp="children" placeholder="Select Location">
                {location.map((item) => {
                  return (
                    <Option value={item.locationId}>{item.locationName}</Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 2 }}>  
           <Button type='primary' onClick={getAllGridData}>Submit</Button>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 1}}>
              <Button onClick={onReset}>Reset</Button>
          </Col>
        </Row>
      </Form>
      <br></br>
      <Row gutter={24} style={{ alignContent:'end' }}>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 22}}>
        </Col>
      <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 1}}>
              <Button type='primary' shape='round' onClick={() => generateQrcode(selectedRows)} style={{height:'40px',width:'50px'}}>
                <PrinterOutlined style={{fontSize:'20px'}}/>
              </Button>
        </Col>
      </Row>
         <br></br>
         <Row gutter={24}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 24}}>
          
          <Table scroll={{x:1500}} rowKey={(record) => record.sampleId} columns={columns} dataSource={gridData}       
             rowSelection={{
          ...rowSelection
        }}></Table>
          </Col>
         </Row>
        </Card>
        {Qrcode.length > 0 ? <QrCodesPrint key={Date.now() + Qrcode[0]?.defectCodeId} printQrcodes={closeWindow} closeQrcodePopUp={closeWindow}
          columns={qrcodeWithColumns} newWindow={false} qrcodeInfo={Qrcode} /> : ''}

        </>
    )
}