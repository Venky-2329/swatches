import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
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
import {
  activateOrDeactivate,
  getBrandsData,
  getCategoryData,
  updateCategories,
} from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CategoryForm from './category-form';
import { CategoryReq, categoryDto } from 'libs/shared-models';

export default function CategoryGrid() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(undefined);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    getCategoryData().then((res) => {
      if (res.data) {
        setData(res.data);
      }
    });
  }

  const updateCategory = (category: categoryDto) => {
    const authdata = JSON.parse(localStorage.getItem(''));

    console.log(category.updatedUser);
    updateCategories(category).then((res) => {
      if (res.status) {
        message.success('Updated Succesfully');
        setDrawerVisible(false);
        getData();
      } else {
        message.error(res.internalMessage);
      }
    });
  };

  const deleteCategory = (val: CategoryReq) => {
    val.isActive = val.isActive ? false:true;
    activateOrDeactivate(val).then((res) => {
      if (res.status) {
        // console.log('okkkkkkkkkkk');
        message.success(res.internalMessage, 2);
        getData();
      } else {
        message.error(res.internalMessage);
      }
    });
  };

  // console.log(deleteCategory, '....................');

  const openFormWithData = (viewData: categoryDto) => {
    console.log(viewData);
    setDrawerVisible(true);
    setSelectedCategory(viewData);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const columns: any = [
    {
      title: 'S.No',
      render: (val, record, index) => index + 1,
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
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
              deleteCategory(rowData);
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
    navigate('/category-form');
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
            <CategoryForm
              key={Date.now()}
              updateDetails={updateCategory}
              isUpdate={true}
              categoryData={selectedCategory}
              closeForm={closeDrawer}
            />
          </Card>
        </Drawer>
      </Card>
    </>
  );
}
