import { Button, Card, Col, theme, Typography, Row } from 'antd'
import React from 'react'
import { EnvironmentOutlined, BarcodeOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
const { useToken } = theme
const { Text } = Typography

export default function RackCard({ index, racks }) {
    const { token: { colorPrimary, colorPrimaryActive, colorPrimaryBg } } = useToken()
    const colors = {
        Partially: 'orange',
        Fully: 'red',
        Empty: colorPrimary
    }
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
            title={<div style={{ height: 15, paddingLeft: 10 }}>{racks.rackName}</div>}
            bordered
            bodyStyle={{ padding: '3px', overflow: 'unset', display: 'flex', flexWrap: 'wrap' }}
            style={{ padding: '3px' }}
            // colSpan={{ xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }}
            direction='row'

            gutter={24}

        >
            {

                racks.rackDetails.map((r) => 
                {
                    const colSpan = (24/racks.columns)
                    return <ProCard colSpan={colSpan} style={{ background: `linear-gradient(to top, ${colors[r.status]}, transparent)`, paddingBottom: '5px' }} title={r.subRack} bordered  >
                        <Text>Status : {r.status}</Text><br />
                        <Text>Qty : {r.qty}</Text>
                    </ProCard>

                })
            }

        </ProCard>
    )
}
