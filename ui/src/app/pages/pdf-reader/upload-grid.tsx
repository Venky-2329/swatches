import { Button, Table } from 'antd';
import { getPdfData, getPdfGridData } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GenerateFileGrid() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    get()
  }, []);

  function get() {
    getPdfGridData().then((res) => {
        if(res.data){
            setData(res.data)
        }else{
            setData([])
        }
    });
  }

  const columns = [
    {
        title:'S No',
        render:(val,record,index) => index + 1 
    },
    {
        title:'Style',
        dataIndex:'style'
    },
    {
        title:'Season',
        dataIndex:'season'
    },
    {
        title:'PO #',
        dataIndex:'poNumber'
    },
    {
        title:'Qty',
        dataIndex:'quantity'
    },
    {
        title:'Item No',
        dataIndex:'itemNo'
    },
    {
        title:'Factory',
        dataIndex:'factory'
    },
    {
        title:'Generate',
        render:(val,record)=>{
            return (
                <Button onClick={ e=> navigate(`/trim-card-doc/${record.pdfId}`)}>Generate</Button>
            )
        }
    }
  ]
  return (<>
    <Table columns={columns} dataSource={data} scroll={{x:1500}}></Table>
  </>);
}
