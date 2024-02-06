import { Button, Card, Col, Form, Input, Row, Select, Upload, notification } from "antd";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import { createSample, getBrandsData, getCategoryData, getLocationData, getSeasonData, uploadPhoto } from "libs/shared-services";
import imageCompression from 'browser-image-compression';

import { useNavigate } from "react-router-dom";

export default function SampleUpload(){
  const Option = Select
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<any[]>([]);
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

      const handleRemove = (file) => {
        setFileList([]);
        // Additional logic for removing file
      };

      const handleBeforeUpload = async (file) => {
        if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
          notification.info({ message: 'Only png, jpeg, jpg files are allowed!' });
          return true;
        }
    
        try {
          const compressedImage = await compressImage(file);
    
          if (fileList.length === 1) {
            notification.info({ message: 'You Cannot Upload More Than One File At A Time' });
            return true;
          } else {
            setFileList([...fileList, compressedImage]);
            return false;
          }
        } catch (error) {
          return true; // Returning true to prevent uploading if an error occurs
        }
      };
    
      const compressImage = async (file) => {
        try {
          const options = {
            maxSizeMB: 0.5, // Adjust the maximum size as needed
            // maxWidthOrHeight: 1920, // Adjust the maximum width or height as needed
            useWebWorker: true,
          };
          const compressedBlob = await imageCompression(file, options);
          const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
          return compressedFile;
        } catch (error) {
          throw error;
        }
      };
    
      const uploadFieldProps = {
        multiple: false,
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
    

    //   const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    //     setFileList(newFileList);
    //   };

      function createSampleUpload(values){
        createSample(values).then((res)=>{
           if(res.status){
            if (fileList.length > 0) {
                const formData = new FormData();
                fileList.forEach((file : any) => {
                  formData.append('file', file);
                });
                formData.append('id', `${res.data.sampleId}`)
                uploadPhoto(formData).then(fileres => {
                    if(res.status){
                        res.data.filePath = fileres.data
                        notification.success({message:res.internalMessage,placement:'top',duration:1})
                        onReset()
                        gotoGrid()
                    }else{
                        notification.error({message:res.internalMessage,placement:'top',duration:1})
                    }
                })
              }
           }else{
            notification.info({message:res.internalMessage,placement:'top',duration:1})
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
                        <Form.Item label='Brand' name={'brandId'}
                         rules={[{ required: true, message: 'Please input Brand' }]}>
                        <Select showSearch  optionFilterProp="children" placeholder="Select Brand">
                                {brands.map((item) => {
                                    return (<Option value={item.brandId}>{item.brandName}</Option>);
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Form.Item hidden name={'createdUser'} initialValue={createUser}><Input defaultValue={createUser}/></Form.Item>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Style No' name={'styleNo'}
                        rules={[{ required: true, message: 'Please input Style No' }]}>
                            <Input placeholder="Enter Style No"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Item No' name={'itemNo'}
                        rules={[{ required: false, message: 'Please input Item No' }]}>
                            <Input placeholder="Enter Item No"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Item Description' name={'itemDescription'}
                        rules={[{ required: false, message: 'Please input Item Description' }]}>
                            <Input placeholder="Enter Item Description"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                         <Form.Item label='Category Type' name={'categoryType'}>
                             <Select placeholder='Select Type'>
                                <Option value={'denim'}>Denim</Option>
                                <Option value={'woven'}>Woven</Option>
                             </Select>
                         </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Category' name={'categoryId'}
                        rules={[{ required: false, message: 'Please input Category' }]}>
                        <Select showSearch  optionFilterProp="children" placeholder="Select Category" >
                                {category.map((item) => {
                                    return (<Option value={item.categoryId}>{item.categoryName}</Option>);
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Season' name={'seasonId'}
                        rules={[{ required: false, message: 'Please input Season' }]}>
                        <Select showSearch  optionFilterProp="children" placeholder="Select season" >
                                {seasons.map((item) => {
                                    return (<Option value={item.seasonId}>{item.seasonName}</Option>);
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Mill' name={'mill'}
                        rules={[{ required: false, message: 'Please input Mill' }]}>
                            <Input placeholder="Enter Mill"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Fabric Content' name={'fabricContent'}
                        rules={[{ required: false, message: 'Please input Fabric Content' }]}>
                            <Input placeholder="Enter Fabric Content"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Fabric Count' name={'fabricCount'}
                        rules={[{ required: false, message: 'Please input Fabric Count' }]}>
                            <Input placeholder="Enter Fabric Count"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='GSM' name={'gsm'}
                        rules={[{ required: false, message: 'Please input GSM' }]}>
                            <Input placeholder="Enter GSM"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='FOB' name={'fob'}
                        rules={[{ required: false, message: 'Please input FOB' }]}>
                            <Input placeholder="Enter FOB"/>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Quantity' name={'quantity'}
                        rules={[{ required: false, message: 'Please input Quantity' }]}>
                            <Input placeholder="Enter Quantity"/>
                        </Form.Item>
                    </Col>
                    {/* <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Qty/Season' name={'qtyPerSeason'}
                        rules={[{ required: false, message: 'Please input Qty/Season' }]}>
                            <Input placeholder="Enter Qty/Season"/>
                        </Form.Item>
                    </Col> */}
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='Loaction' name={'locationId'}
                        rules={[{ required: false, message: 'Please input Location' }]}>
                        <Select showSearch  optionFilterProp="children" placeholder="Select Location" >
                                {location.map((item) => {
                                    return (<Option value={item.locationId}>{item.locationName}</Option>);
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4}}>
                        <Form.Item label='SMV' name={'smv'}
                        rules={[{ required: false, message: 'Please input SMV' }]}>
                            <Input placeholder="Enter SMV"/>
                        </Form.Item>
                    </Col>
                </Row>
               <Row gutter={24}>
             <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 5}}>
                <Upload
                  {...uploadFieldProps}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={onPreview}
                  style={{ width: '200px', height: '200px' }}
                >
                  {fileList.length < 5 && '+ Upload'}
                </Upload>
            </Col>
          </Row>
          <br></br>
          <Row gutter={24} style={{alignContent:'end'}}>
          <Col  xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 2}}>
                        <Button htmlType="submit" type="primary">Submit</Button>
                    </Col>
                    <Col  xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 1}}>
                        <Button onClick={onReset}>Reset</Button>
                    </Col>
             </Row>
            </Form>
        </Card>
        </>
    )
}