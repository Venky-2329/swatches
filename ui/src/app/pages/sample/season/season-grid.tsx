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
  activateOrDeactivateSeason,
  getBrandsData,
  getCategoryData,
  getSeasonData,
  updateSeason,
} from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RightSquareOutlined, EditOutlined } from '@ant-design/icons';
import { SeasonDto, seasonReq } from 'libs/shared-models';
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

  console.log(data)

  const updateSeasonData = (season: SeasonDto) => {
    console.log(season)
    const authdata = JSON.parse(localStorage.getItem(''));
    updateSeason(season).then((res) => {
      if (res.status) {
        message.success(res.internalMessage);
        setDrawerVisible(false);
        getData();
      }
    });
  };

  const activateOrDeactivate = (req : seasonReq) => {
    req.isActive = req.isActive ? false: true
    activateOrDeactivateSeason(req).then((res) => {
      if(res.status){
        message.success(res.internalMessage , 2)
        getData();
      }
    })
  }

  const openFormWithData = (values: SeasonDto) => {
    console.log(values)
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
      render: (val, rowdata) => (
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
          onConfirm={() => {activateOrDeactivate(rowdata)}}
            title={
              rowdata.isActive
                ? 'Are you sure to Deactivate this Season ?'
                : 'Are you sure to Activate this Season ?'
            }
          >
            <Switch 
            size='default'
            className={rowdata.isActive ? 'toggle-activated' : 'toggle-deactivated'}
            checkedChildren = {<RightSquareOutlined type="check" />}
            unCheckedChildren = {<RightSquareOutlined type="close" />}
            checked = {rowdata.isActive}
            />
          </Popconfirm>
        </span>
      )

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
              Create
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
          width={window.innerWidth > 768 ? '65%' : '85%'}
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
