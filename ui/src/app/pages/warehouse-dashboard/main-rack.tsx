import { Card, Col, Row, theme } from 'antd'
import React from 'react'
import RackCard from './rack-card'
const { useToken } = theme

export default function MainRackCard(racks,index) {
    const { token: { colorPrimary, colorPrimaryActive, colorPrimaryBg } } = useToken()

   
    return (
        <Row key={index} gutter={24} >
            {/* <div style={{ border: `1px solid ${colorPrimary}` }}> */}
            {/* <div >
                    <h3>{'RACK _ A'}</h3>
                </div> */}
            {
                racks.map((v, i) => {
                    return <Col   xs={{ span: 22 }}
                    sm={{ span: 22 }}
                    md={{ span: 11 }}
                    lg={{ span: 4 }}
                    xl={{ span: 4 }}>
                        <RackCard index={i} racks={v}/>
                    </Col>
                })
            }
            {/* </div> */}

        </Row>
    )
}
