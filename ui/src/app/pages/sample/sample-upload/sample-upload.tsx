import { Button, Card, Col, Form, Input, Row, Select, Upload, notification } from "antd";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import { createSample, getBrandsData, getCategoryData, getLocationData, getSeasonData, uploadPhoto } from "libs/shared-services";
import { Console } from "console";
import { useNavigate } from "react-router-dom";

export default function SampleUpload(){
  const Option = Select
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [brands,setBrands] = useState([]);
    const [category,setCategory] = useState([]);
    const [location,setLocation] = useState([]);
    const [seasons,setSeasons] = useState([]);
    const users: any = JSON.parse(localStorage.getItem('auth'))
    const createUser = users.userName

    useEffect(()=>{
      getBrands();
      getCategories();
      getLocations();
      getSeason();
    },[])

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
        setFileList([])
      }

    function onFinish(values) {
        createSampleUpload(values)
      }

      const uploadFieldProps: UploadProps = {
        multiple: false,
        onRemove: file => {
          setFileList([]);
          // uploadFileList([]);
        },
        beforeUpload: (file: any) => {
          if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
            notification.info({message:'Only png, jpeg, jpg files are allowed!'})
            return true;
          }
          var reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = data => {
            if (fileList.length === 1) {
              notification.info({message:'You Cannot Upload More Than One File At A Time'})
              return true;
            } else {
              setFileList([...fileList, file]);
              // uploadFileList([...filelist, file]);
              return false;
            }
          };
    
          // Add a default return value for cases where none of the conditions are met
          return false;
        },
        progress: {
          strokeColor: {
            '0%': '#108ee9',
            '100%': '#87d068',
          },
          strokeWidth: 3,
          format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
        fileList: fileList
      };

    //   const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    //     setFileList(newFileList);
    //   };

      function createSampleUpload(values){
        createSample(values).then((res)=>{
           if(res.status){
            console.log(res)
            if (fileList.length > 0) {
                const formData = new FormData();
                console.log(fileList)
                fileList.forEach((file : any) => {
                  formData.append('file', file);
                });
                formData.append('id', `${res.data.sampleId}`)
                console.log(formData)
                uploadPhoto(formData).then(fileres => {
                    if(res.status){
                        res.data.filePath = fileres.data
                        notification.success({message:res.internalMessage})
                        onReset()
                        gotoGrid()
                    }else{
                        notification.error({message:res.internalMessage})
                    }
                })
              }
           }else{
            notification.info({message:res.internalMessage})
           }
        })
      }
      
      const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as RcFile);
            reader.onload = () => resolve(reader.result as string);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      };  

      function gotoGrid(){
        navigate('/sample-view')
      }
    return(
        <>
        <Card title='Add Sample' extra={<span><Button type="primary" onClick={gotoGrid}>View</Button></span>}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={24}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Brand' name={'brandId'}>
                        <Select showSearch placeholder="Select Brand" >
                                {brands.map((item) => {
                                    return (<Option value={item.brandId}>{item.brandName}</Option>);
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Form.Item hidden name={'createdUser'} initialValue={createUser}><Input defaultValue={createUser}/></Form.Item>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Style No' name={'styleNo'}>
                            <Input placeholder="Enter Style No"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Item No' name={'itemNo'}>
                            <Input placeholder="Enter Item No"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Item Description' name={'itemDescription'}>
                            <Input placeholder="Enter Item Description"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Quantity' name={'quantity'}>
                            <Input placeholder="Enter Quantity"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Category' name={'categoryId'}>
                        <Select showSearch placeholder="Select Category" >
                                {category.map((item) => {
                                    return (<Option value={item.categoryId}>{item.categoryName}</Option>);
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Season' name={'seasonId'}>
                        <Select showSearch placeholder="Select season" >
                                {seasons.map((item) => {
                                    return (<Option value={item.seasonId}>{item.seasonName}</Option>);
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Fabric Content' name={'fabricContent'}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Fabric Count' name={'fabricCount'}>
                            <Input placeholder="Enter Fabric Count"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='GSM' name={'gsm'}>
                            <Input placeholder="Enter GSM"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='FOB' name={'fob'}>
                            <Input placeholder="Enter FOB"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Qty/Season' name={'qtyPerSeason'}>
                            <Input placeholder="Enter Qty/Season"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Loaction' name={'locationId'}>
                        <Select showSearch placeholder="Select Location" >
                                {location.map((item) => {
                                    return (<Option value={item.locationId}>{item.locationName}</Option>);
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
               <Row gutter={24}>
             <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 5}}>
              {/* <ImgCrop zoomSlider={false} rotationSlider> */}
                <Upload
                  {...uploadFieldProps}
                  listType="picture-card"
                  fileList={fileList}
                //   onChange={onChange}
                  onPreview={onPreview}
                  style={{ width: '200px', height: '200px' }}
                >
                  {fileList.length < 5 && '+ Upload'}
                </Upload>
              {/* </ImgCrop> */}
            </Col>
          </Row>
          <br></br>
          <Row gutter={24} style={{alignContent:'end'}}>
          <Col  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 2}}>
                        <Button htmlType="submit" type="primary">Submit</Button>
                    </Col>
                    <Col  xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 1}}>
                        <Button onClick={onReset}>Reset</Button>
                    </Col>
             </Row>
            </Form>
        </Card>
        </>
    )
}