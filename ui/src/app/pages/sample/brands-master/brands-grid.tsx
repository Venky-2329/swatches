import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Popconfirm,
  Row,
  Table,
  message,
} from 'antd';
import {
  activateOrDeactivateBrands,
  getBrandsData,
  updateBrands,
} from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { BrandDto } from 'libs/shared-models';
import BrandsForm from './brands-form';

export default function BrandsGrid() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(undefined);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    getBrandsData().then((res) => {
      if (res.data) {
        setData(res.data);
      }
    });
  }

  const updateBrand = (brand: BrandDto) => {
    console.log(brand);

    const authdata = JSON.parse(localStorage.getItem(''));
    console.log(authdata, '---------authdata');

    console.log(brand.updatedUser);
    updateBrands(brand)
      .then((res) => {
        if (res.status) {
          message.success('Updated Succesfully');
          setDrawerVisible(false);
          getData();
        } else {
          message.error(res.internalMessage);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const deleteBrand = (val: any) => {
    activateOrDeactivateBrands(val).then((res) => {
      if (res.status) {
        message.success(res.internalMessage);
        getData();
      } else {
        message.error(res.internalMessage);
      }
    });
  };

  const openFormWithData = (viewData: BrandDto) => {
    setDrawerVisible(true);
    setSelectedBrand(viewData);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const columns: any = [
    {
      title: 'S.No',
      render: (val, record, index) => index + 1,
    },
    // {
    //   title: 'Brand Code',
    //   dataIndex: 'brandCode',
    // },
    {
      title: 'Brand Name',
      dataIndex: 'brandName',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (val, rowData) => (
        <span>
          <EditOutlined
            type="edit"
            onClick={() => {
              openFormWithData(rowData);
            }}
            style={{ color: 'blue', fontSize: '14px' }}
          />
          <Divider type="vertical" />
          <Popconfirm
            onConfirm={(e) => {
              deleteBrand(rowData);
            }}
            title={
              rowData.isActive
                ? 'Are you sure to Deactivate this Brand ?'
                : 'Are you sure to Deactivate this Brand ?'
            }
          >

          </Popconfirm>
        </span>
      ),
    },
  ];

  function goToForm() {
    navigate('/brands-form');
  }

  return (
    <>
      <Card
        title="Brands"
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        extra={
          <span>
            <Button onClick={goToForm}>
              Create
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
          title="Update"
          width={window.innerWidth > 768 ? '80%' : '85%'}
          onClose={closeDrawer}
          visible={drawerVisible}
          closable={true}
        >
          <Card
            headStyle={{ textAlign: 'center', fontWeight: 500, fontSize: 16 }}
            size="small"
          >
            <BrandsForm
              key={Date.now()}
              updateDetails={updateBrand}
              isUpdate={true}
              brandData={selectedBrand}
              closeForm={closeDrawer}
            />
          </Card>
        </Drawer>
      </Card>
    </>
  );
}
