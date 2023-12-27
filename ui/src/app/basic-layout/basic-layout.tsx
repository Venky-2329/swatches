import styles from './basic-layout.module.css';
import { Link, Outlet, HashRouter as Router, useNavigate } from 'react-router-dom';
import { ProBreadcrumb, ProConfigProvider } from '@ant-design/pro-components';
import ProLayout from '@ant-design/pro-layout';
import { LightModeIcon } from '../icons/lightmode.icon';
import { treeRouter } from '../utils/common';
import { DarkModeIcon } from '../icons/darkmode.icon';
import { useState } from 'react';
import { Button, Tooltip, theme } from 'antd';
import { UserOutlined, PieChartOutlined, LogoutOutlined, TableOutlined, PicCenterOutlined } from '@ant-design/icons'
import { LogoIcon } from '../icons/logo-icon';

const { useToken } = theme
/* eslint-disable-next-line */
export interface BasicLayoutProps { }



export function BasicLayout(props: BasicLayoutProps) {
  const [pathname, setPathname] = useState(location.pathname);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const { token: { colorPrimary, colorPrimaryActive, colorPrimaryBg } } = useToken()

  function handleLogout() {
    localStorage.clear()
    // navigate('/login')
  }

  const baseRouterList: any[] = [
    {
      label: "Trim Card Upload",
      key: "trim-card",
      path: "trim-card",
      icon: <TableOutlined />,
      filepath: "../",
    },
    {
      label: "Trim Card ",
      key: "trim-card-form",
      path: "trim-card-form",
      icon: <TableOutlined />,
      filepath: "../",
    },
    {
      label: "Trim Card Doc",
      key: "trim-card-doc",
      path: "trim-card-doc",
      icon: <TableOutlined />,
      filepath: "../",
    },
    
  ]
  return (
    <ProConfigProvider dark={dark}  >
      <div
        id="main-layout"
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          title="Trim Card"
          logo={<LogoIcon  />}
          locale='en-US'
          siderWidth={240}
          colorPrimary='#22C55E'
          headerContentRender={(props) => props.layout !== 'side' && document.body.clientWidth > 1000 ? <ProBreadcrumb /> : undefined}
          fixSiderbar
          layout='mix'
          token={{ header: { colorBgHeader: 'transparent' }, sider: { colorBgMenuItemSelected: colorPrimaryBg } }}
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
            title: 'admin',
            style: { color: colorPrimary }
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
                  icon={!dark ? <DarkModeIcon style={{ color: "#22C55E" }} /> : <LightModeIcon style={{ color: "#22C55E" }} />}
                ></Button>
              </Tooltip>,
              <Tooltip placement="bottom" title={"Sign Out"}>
                <Button

                  size="large"
                  // style={{ borderRadius: "5px" }}
                  icon={
                    <LogoutOutlined
                      style={{ color: '#22C55E' }}
                      onClick={async () => {
                        // await signOut(dispatch);
                        handleLogout()
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
                to={item?.path || "/"}
                onClick={() => {
                  setPathname(item.path || "/");
                }}
              >
                {dom}
              </Link>
            );
          }}
          onMenuHeaderClick={() => navigate("/")}
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
