import { Button, Card, Col, theme,Typography } from 'antd'
import React from 'react'
import { EnvironmentOutlined, BarcodeOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
const { useToken } = theme
const {Text} = Typography

export default function RackCard({ index, item, location }) {
    const { token: { colorPrimary, colorPrimaryActive, colorPrimaryBg } } = useToken()
    return (
        // <Col key={index} xs={12} sm={6} md={4} lg={3} style={{border:`1px solid ${colorPrimary}`}}>
        //     <Card  style={{ borderRadius: '8px', }} bordered   bodyStyle={{ padding: '0px' }}
        //     >
        //         <div style={{ height: '110px', position: 'relative' }}>
        //             <div
        //                 style={{
        //                     position: 'absolute',
        //                     top: '10px',
        //                     left: '50%',
        //                     transform: 'translateX(-50%)',
        //                     width: '90%',
        //                     height: '90px',
        //                     background: colorPrimaryActive,
        //                     borderRadius: '4px',
        //                 }}
        //             >
        //                 {/* Simulated shelves or items */}
        //                 <div style={{ textAlign: 'center', marginTop: '8px' }}>
        //                     <EnvironmentOutlined />
        //                     <span style={{ marginLeft: '4px' }}>{location}</span>
        //                 </div>
        //                 <div style={{ textAlign: 'center', marginTop: '4px' }}>
        //                     {/* <BarcodeOutlined /> */}
        //                     <span style={{ marginLeft: '4px' }}>ITEM: {item}</span>
        //                 </div>

        //             </div>
        //         </div>
        //         <div style={{ textAlign: 'center', }}>
        //             <Button>Stock out</Button>
        //         </div>

        //     </Card>
        // </Col>
        <ProCard
            ghost
            title={<div style={{ height: 15 }}>{'RACK A'}</div>}
            bordered
            bodyStyle={{padding:'3px'}}
            style={{padding:'3px'}}
            colSpan={{ xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }}
          
        >
            <ProCard   colSpan={{ xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }}  bordered >
                {/* <div style={{ height: 30 }}>{location}</div> */}
                {/* <div style={{ height: 30 }}>{item}</div> */}
                <Text>Hello</Text>
            </ProCard>
            <ProCard   colSpan={{ xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }}  bordered>
                {/* <div style={{ height: 30 }}>{location}</div> */}

                {/* <div style={{ height: 30 }}>{item}</div> */}
            </ProCard>
        </ProCard>
    )
}
