import { Button, Card, Input, Space } from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import { Link } from 'react-router-dom';
import { ApprovalUserService } from 'libs/shared-services';

export default function ApproverGrid() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const service = new ApprovalUserService();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    service.getAllApprovalUser().then((res) => {
      if (res.data) {
        setData(res.data);
      }
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'S.No',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Approver Name',
      dataIndex: 'approvedUserName',
    },
    {
      title: 'Email ID',
      dataIndex: 'emailId',
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   render: (_, record) => (
    //     <Space>
    //       <Button
    //         type="primary"
    //         icon={<EditOutlined />}
    //         onClick={() => handleEdit(record)}
    //       >
    //         {/* Edit */}
    //       </Button>
    //       <Button
    //         danger
    //         icon={<DeleteOutlined />}
    //         onClick={() => handleDelete(record)}
    //       >
    //         {/* Delete */}
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <>
      <Card
        title={'Approvers'}
        headStyle={{ backgroundColor: '#25529a', color: 'white' }}
        extra={
          <Link to="/approval-form">
            <Button>Create </Button>
          </Link>
        }
      >
        <Table
          rowKey={(record) => record.key}
          columns={columns}
          dataSource={data}
        ></Table>
      </Card>
    </>
  );
}
