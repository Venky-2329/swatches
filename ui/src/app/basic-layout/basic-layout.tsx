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
import { useEffect, useState } from 'react';
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
  const createUser = JSON.parse(localStorage.getItem('auth'));
  const user = createUser.userName;
  const userRole = createUser.role;

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  const baseRouterList: any[] = [
    {
      label: 'Masters',
      path: '/masters',
      icon: <PicCenterOutlined />,
      filepath: '../',
      children: [
        {
          label: 'Approval Users',
          key: 'approval-grid',
          path: '/approval-grid',
          icon: <TableOutlined />,
          filepath: '../',
        },
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
          label: 'Users',
          key: 'user-grid',
          path: '/user-grid',
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
          label: 'Fabric',
          key: 'fabric-swatch-approval',
          path: '/fabric-swatch-approval',
          icon: <UploadOutlined />,
          filepath: '../',
        },
        {
          label: 'Trims',
          key: 'trims-swatch-approval',
          path: '/trims-swatch-approval',
          icon: <UploadOutlined />,
          filepath: '../',
        },
        // {
        //   label: 'Fabric Approval',
        //   key: 'fabric-swatch-approval',
        //   path: '/fabric-swatch-approval',
        //   icon: <UploadOutlined />,
        //   filepath: '../',
        // },
        // {
        //   label: 'Trim Approval',
        //   key: 'trims-swatch-approval',
        //   path: '/trims-swatch-approval',
        //   icon: <UploadOutlined />,
        //   filepath: '../',
        // }
      ],
    },
    {
      label: 'Design Studio',
      key: 'sample-cards',
      path: 'sample-cards',
      icon: <RobotOutlined />,
      filepath: '../',
    },
    {
      label: 'Fabric-Swatch-Cards',
      key: 'fabric-swatch-cards',
      path: '/fabric-swatch-cards',
      icon: <RobotOutlined />,
      filepath: '../',
    },
    {
      label: 'Trim-Swatch-Cards',
      key: 'trim-swatch-cards',
      path: 'trim-swatch-cards',
      icon: <RobotOutlined />,
      filepath: '../',
    },
  ];

  const filteredRouterList = baseRouterList.reduce((acc, route) => {
    const department = createUser.departmentId;

    if (userRole === 'ADMIN') {
        acc.push(route);
    } else if (userRole === 'TRIMS' || userRole === 'FABRICS') {
        if (route.path === '/swatch-card') {
            const swatchCardRoute = {
                ...route,
                children: route.children.filter((child) => {
                    if (userRole === 'TRIMS' && department === 1) {
                        return child.key === 'trims-swatch-approval';
                    } else if (userRole === 'TRIMS' && department === 2) {
                        return child.key === 'trims-swatch-approval';
                    } else if (userRole === 'FABRICS' && department === 1) {
                        return child.key === 'fabric-swatch-approval' || child.key === 'fabric-swatch-cards';
                    } else if (userRole === 'FABRICS' && department === 2) {
                        return child.key === 'fabric-swatch-approval' || child.key === 'fabric-swatch-cards';
                    } else if (userRole === 'FABRICS' && department === 3) {
                        return child.key === 'fabric-swatch-cards';
                    } else if (userRole === 'TRIMS' && department === 2) {
                        return child.key === 'trims-swatch-approval' || child.key === 'trim-swatch-cards';
                    } else if (userRole === 'TRIMS' && department === 3) {
                        return child.key === 'trim-swatch-cards';
                    }
                }),
            };
            acc.push(swatchCardRoute);
        }
    }
    return acc;
}, []);




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
            routes: treeRouter(filteredRouterList),
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
