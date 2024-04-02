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
  getBrandsData,
  getCategoryData,
  getSeasonData,
  updateSeason,
} from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { SeasonDto } from 'libs/shared-models';
import SeasonForm from './season-form';

export default function SeasonGrid() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<any>();

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    getSeasonData().then((res) => {
      if (res.data) {
        setData(res.data);
      }
    });
  }

  const updateSeasonData = (season: SeasonDto) => {
    const authdata = JSON.parse(localStorage.getItem(''));

    updateSeason(season).then((res) => {
      if (res.status) {
        message.success(res.internalMessage);
      }
    });
  };

  const openFormWithData = (values: SeasonDto) => {
    setDrawerVisible(true);
    setSelectedSeason(values);
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
      title: 'Season',
      dataIndex: 'seasonName',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (val, rowdata) => {
        <span>
          <EditOutlined
            type="edit"
            onClick={() => {
              if (rowdata.isActive) {
                openFormWithData(rowdata);
              } else {
                message.error('You Cannot Edit Deactivated Address');
              }
            }}
            style={{ color: '#1890ff', fontSize: '14px' }}
          ></EditOutlined>

          <Divider type="vertical" />
          <Popconfirm
            title={
              rowdata.isActive
                ? 'Are you sure to Delete this Season ?'
                : 'Are you sure to Delete this Season ?'
            }
          >
            <DeleteOutlined />
          </Popconfirm>
        </span>;
      },
    },
  ];

  function goToForm() {
    navigate('/season-form');
  }

  return (
    <>
      <Card
        title="Seasons"
        extra={
          <span>
            <Button onClick={goToForm} type="primary">
              Add
            </Button>
          </span>
        }
      >
        <Row gutter={24}>
          <Col span={24}>
            <Table columns={columns} dataSource={data}></Table>
          </Col>
        </Row>
        <Drawer
          bodyStyle={{ paddingBottom: 80 }}
          title="Update"
          visible={drawerVisible}
          onClose={closeDrawer}
          closable={true}
        >
          <SeasonForm
            seasonData={selectedSeason}
            isUpdate={true}
            updateDetails={updateSeasonData}
            key={Date.now()}
            closeForm={closeDrawer}
          />
        </Drawer>
      </Card>
    </>
  );
}
