import {
  Card,
  Col,
  Row,
  notification,
  Select,
  Button,
  Modal,
  Form,
  Badge,
} from 'antd';
import Meta from 'antd/es/card/Meta';
import {
  getBrandsData,
  getCategoryData,
  getAllSamplesData,
  getLocationData,
  getSeasonData,
  deleteUploadFile,
} from 'libs/shared-services';
import { useEffect, useState } from 'react';
import image from '../../../../assets/download (2)-a875.jpg';
import ReactDOMServer from 'react-dom/server';
import jsPDF from 'jspdf';
import DownloadCard from './download-pdf';
import { FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';
import { QRCode, Space } from 'antd';
import DownloadQrCode from './download-qr';
import { SampleCardReq, SampleDelReq } from 'libs/shared-models';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'

const { Option } = Select;

export default function SampleCards() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [qrData, setQrData] = useState([]);
  const [visble, setVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsData, setDetailsData] = useState(undefined);
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [filters,setFilters] = useState([])
  const users: any = JSON.parse(localStorage.getItem('auth'))
  const userName = users.userName

  useEffect(() => {
    getBrands();
    getCategories();
    getLocations();
    getSeason();
    getSampleCards();
    filtersData();
  }, []);

  function getBrands() {
    getBrandsData().then((res) => {
      if (res.data) {
        setBrands(res.data);
      }
    });
  }

  function getCategories() {
    getCategoryData().then((res) => {
      if (res.data) {
        setCategory(res.data);
      }
    });
  }

  function getLocations() {
    getLocationData().then((res) => {
      if (res.data) {
        setLocation(res.data);
      }
    });
  }

  function getSeason() {
    getSeasonData().then((res) => {
      if (res.data) {
        setSeasons(res.data);
      }
    });
  }

  function ViewDetails(values) {
    console.log(values);
    navigate(`/separete-card/${values.sampleId}`);
    setDetailsData(values);
  }

  function onCancel() {
    setVisible(false);
  }
  function detailsViewCancel() {
    setDetailsVisible(false);
  }

  function getSampleCards() {
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
        setData(res.data);
        // notification.success({ message: res.internalMessage });
      } else {
        notification.error({ message: res.internalMessage,placement:'top',duration:1 });
      }
    });
  }

  function deleteFile(val){
    const req = new SampleDelReq();
    req.sampleId = val.sampleId;
    req.updatedUser = userName;
    deleteUploadFile(req).then((res)=>{
      if(res.status){
        getSampleCards();
         notification.success({message:res.internalMessage})
      }else{
        notification.error({message:res.internalMessage})
      }
    })
  }

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

function onReset(){
  form.resetFields();
  getSampleCards();
}

  function downloadPdf(val) {
    var quranHtml: any = ReactDOMServer.renderToString(
      <DownloadCard data={val} />
    );
    var doc = new jsPDF();
    doc.html(quranHtml, {
      callback: function (doc) {
        doc.save();
      },
      margin: 5,
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 100, //target width in the PDF document
      windowWidth: 200, //window width in CSS pixels
    });
  }

    const backgroundColors = ['#c8ffc8', '#ffffa0', '#facefa', '#ccccff','#ffd2d2','#d2e1ff','#d2faff','#ffeee8'];
  return (
    <PageContainer title={<span>Design Room  {<Badge count={data.length} style={{ backgroundColor: '#52c41a' }}/>}</span>}>
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}
          >
            <Form.Item label="Brand" name={'brandId'}>
              <Select allowClear showSearch  optionFilterProp="children" placeholder="Select Brand">
                {brands.map((item) => {
                  return <Option value={item.brandId}>{item.brandName}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}
          >
            <Form.Item label="Item No" name={'itemNo'}>
              <Select allowClear showSearch  optionFilterProp="children" placeholder="Select Item No">
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
              <Select allowClear showSearch  optionFilterProp="children" placeholder="Select Style">
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
              <Select allowClear showSearch  optionFilterProp="children" placeholder="Select Category">
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
              <Select allowClear showSearch  optionFilterProp="children" placeholder="Select season">
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
            <Form.Item label="Loaction" name={'locationId'}>
              <Select allowClear showSearch  optionFilterProp="children" placeholder="Select Location">
                {location.map((item) => {
                  return (
                    <Option value={item.locationId}>{item.locationName}</Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
         
        </Row>
        <Row justify='end'>
        <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 2}}>  
           <Button type='primary' onClick={getSampleCards}>Submit</Button>
          </Col>
          <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 1 }}>
              <Button onClick={onReset}>Reset</Button>
          </Col>
        </Row>
      </Form>
      <br></br>
      <Row gutter={[24, 24]}>
        {data.map((i,index) => {
          const { brandName, styleNo, itemNo,categoryName ,createdDate} = i;
          const date = moment(createdDate).format('YYYY-MM-DD')
          const cardStyle = {
            background: backgroundColors[index % backgroundColors.length],
            color: 'black',
          };
          return (
            <Col key={i.sampleId} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
              <Card
                hoverable
                style={cardStyle}
                cover={
                  <img
                  style={{ height: '100%', objectFit: 'cover' }}
                    alt="example"
                    src={'http://172.20.50.169/design_room/dist/services/kanban-service/upload-files/'+ i.fileName}
                    onClick={() => ViewDetails(i)}
                  />
                }
              >
               <Row gutter={24}>
                <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 15}}>
                  <Button icon={<DeleteOutlined />} onClick={() => deleteFile(i)}></Button>
                </Col>
                <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 2}}>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => downloadPdf(i)}
                ></Button>
                </Col>
               </Row>
                <Meta
                  description={
                    <div className="print">
                      <div><b>{brandName}</b></div>
                      <div><b>{date}</b></div>
                      <div>Style No&nbsp;&nbsp; : {styleNo}</div>
                      <div>Category&nbsp;&nbsp; : {categoryName}</div>
                    </div>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
      {/* <Modal onCancel={onCancel} open={visble} footer={false}>
        <DownloadQrCode data={qrData} />
      </Modal> */}
      {/* <Modal open={detailsVisible} onCancel={detailsViewCancel} footer={false}>
        <Card title="Sample Digital Card Details">
          <div className="print">
            <b>
              Brand
              Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.brandName}
            <br></br>
            <b>
              Style
              No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.styleNo}
            <br></br>
            <b>
              Item
              No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.itemNo}
            <br></br>
            <b>Item Description&nbsp;&nbsp;&nbsp;&nbsp; :</b>{' '}
            {detailsData?.itemDescription}
            <br></br>
            <b>
              Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.categoryName}
            <br></br>
            <b>
              Season&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.seasonName}
            <br></br>
            <b>
              Fabric
              Content&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.fabricContent}
            <br></br>
            <b>
              Fabric
              Count&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.fabricCount}
            <br></br>
            <b>
              GSM
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.gsm}
            <br></br>
            <b>
              FOB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.fob}
            <br></br>
            <b>
              Qty/Season&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.qtyPerSeason}
            <br></br>
            <b>
              Location&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </b>{' '}
            {detailsData?.locationName}
          </div>
        </Card>
      </Modal> */}
    </PageContainer>
  );
}
