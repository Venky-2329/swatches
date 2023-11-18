import { Dropdown, Space, type MenuProps } from 'antd';
import React from 'react'
import {DownOutlined} from '@ant-design/icons'

export default function FilterDropdown() {
    const items: MenuProps['items'] = [
        {
            label: '1st menu item',
            key: '1',
        },
        {
            label: '2nd menu item',
            key: '2',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];

    const onClick: MenuProps['onClick'] = ({ key }) => {
    };
    return (
        <Dropdown menu={{ items, onClick }}>
            <a onClick={(e) => e.preventDefault()}>
                {/* <Space> */}
                    Hover me, Click menu item
                    <DownOutlined />
                {/* </Space> */}
            </a>
        </Dropdown>
    )
}
