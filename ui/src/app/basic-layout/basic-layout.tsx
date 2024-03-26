import styles from './basic-layout.module.css';
import {
  Link,
  Outlet,
  HashRouter as Router,
  useNavigate,
} from 'react-router-dom';
import { ProBreadcrumb, ProConfigProvider } from '@ant-design/pro-components';
import { RiScissorsCutLine } from 'react-icons/ri';
import ProLayout from '@ant-design/pro-layout';
import { LightModeIcon } from '../icons/lightmode.icon';
import { treeRouter } from '../utils/common';
import { DarkModeIcon } from '../icons/darkmode.icon';
import { useState } from 'react';
import { Button, Tooltip, theme } from 'antd';
import {
  UserOutlined,
  RobotOutlined,
  LogoutOutlined,
  TableOutlined,
  PicCenterOutlined,
  UploadOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { LogoIcon } from '../icons/logo-icon';

const { useToken } = theme;
/* eslint-disable-next-line */
export interface BasicLayoutProps {}

export function BasicLayout(props: BasicLayoutProps) {
  const [pathname, setPathname] = useState(location.pathname);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorPrimary, colorPrimaryActive, colorPrimaryBg },
  } = useToken();
  const createUser: any = JSON.parse(localStorage.getItem('auth'));
  const user = createUser.userName;

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  const baseRouterList: any[] = [
    // {
    //   label: 'Home',
    //   key: 'home-screen',
    //   path: 'home-screen',
    //   icon: <HomeOutlined />,
    //   filepath: '../',
    // },
    {
      label: 'Masters',
      path: '/masters',
      icon: <PicCenterOutlined />,
      filepath: '../',
      children: [
        {
          label: 'Brand',
          key: 'brands-grid',
          path: '/brands-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
        {
          label: 'Buyer',
          key: 'buyer-grid',
          path: '/buyer-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
        {
          label: 'Category',
          key: 'category-grid',
          path: '/category-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
        {
          label: 'Employee',
          key: 'employee-grid',
          path: '/employee-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
        {
          label: 'Location',
          key: 'location-grid',
          path: '/location-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
        {
          label: 'Season',
          key: 'season-grid',
          path: '/season-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
        {
          label: 'Supplier',
          key: 'supplier-grid',
          path: '/supplier-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
        {
          label: 'Approval Users',
          key: 'approval-grid',
          path: '/approval-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
      ],
    },
    {
      label: 'Swatch Card ',
      path: '/swatch-card',
      icon: <RiScissorsCutLine />,
      filepath: '../',
      children: [
        {
          label: 'Fabric Upload',
          key: 'fabric-swatch-view',
          path: '/fabric-swatch-view',
          icon: <UploadOutlined />,
          filepath: '../',
        },
        {
          label: 'Trims Upload',
          key: 'trims-swatch-view',
          path: '/trims-swatch-view',
          icon: <UploadOutlined />,
          filepath: '../',
        },
        {
          label: 'Fabric Approval',
          key: 'fabric-swatch-approval',
          path: '/fabric-swatch-approval',
          icon: <UploadOutlined />,
          filepath: '../',
        },
        {
          label: 'Trim Approval',
          key: 'trims-swatch-approval',
          path: '/trims-swatch-approval',
          icon: <UploadOutlined />,
          filepath: '../',
        },
      ],
    },
    // {
    //   label: 'Sample Upload',
    //   key: 'sample-view',
    //   path: 'sample-view',
    //   icon: <UploadOutlined />,
    //   filepath: '../',
    // },

    // {
    //   label: 'Design Studio',
    //   key: 'sample-cards',
    //   path: 'sample-cards',
    //   icon: <RobotOutlined />,
    //   filepath: '../',
    // },

    // {
    //   label: "Samples View",
    //   key: "sample-view",
    //   path: "sample-view",
    //   icon: <TableOutlined />,
    //   filepath: "../",
    // },
  ];
  return (
    <ProConfigProvider dark={dark}>
      <div
        id="main-layout"
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          title="Swatch Card"
          logo={<LogoIcon />}
          locale="en-US"
          // layout='top'
          colorPrimary="#035199"
          headerContentRender={(props) =>
            props.layout !== 'side' && document.body.clientWidth > 1000 ? (
              <ProBreadcrumb />
            ) : undefined
          }
          fixSiderbar
          token={{
            header: { colorBgHeader: 'transparent' },
            sider: { colorBgMenuItemSelected: colorPrimaryBg },
          }}
          route={{
            path: '/',
            routes: treeRouter(baseRouterList),
          }}
          location={{
            pathname,
          }}
          avatarProps={{
            src: <UserOutlined />,
            size: 'small',
            title: user,
            style: { color: colorPrimary },
          }}
          contentStyle={{ paddingBlock: '10px', paddingInline: '10px' }}
          actionsRender={(props) => {
            // if (props.isMobile) return [];
            return [
              <Tooltip placement="bottom" title={'Switch mode'}>
                {/* <Switch
                            checkedChildren="🌜"
                            unCheckedChildren="🌞"
                            checked={dark}
                            onChange={(v) => setDark(v)}
                        /> */}
                <Button
                  size="large"
                  // style={{ borderRadius: "5px" }}
                  onClick={() => {
                    setDark(!dark);
                  }}
                  icon={
                    !dark ? (
                      <DarkModeIcon style={{ color: '#035199' }} />
                    ) : (
                      <LightModeIcon style={{ color: '#035199' }} />
                    )
                  }
                ></Button>
              </Tooltip>,
              <Tooltip placement="bottom" title={'Sign Out'}>
                <Button
                  size="large"
                  // style={{ borderRadius: "5px" }}
                  icon={
                    <LogoutOutlined
                      style={{ color: '#035199' }}
                      onClick={async () => {
                        // await signOut(dispatch);
                        handleLogout();
                      }}
                    />
                  }
                ></Button>
              </Tooltip>,
            ];
          }}
          menuItemRender={(item, dom) => {
            return (
              <Link
                to={item?.path || '/'}
                onClick={() => {
                  setPathname(item.path || '/');
                }}
              >
                {dom}
              </Link>
            );
          }}
          onMenuHeaderClick={() => navigate('/')}
        >
          <div style={{ padding: '10px' }}>
            <Outlet />
          </div>
        </ProLayout>
      </div>
    </ProConfigProvider>
  );
}

export default BasicLayout;
