import 'react-pro-sidebar/dist/css/styles.css';
import { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// import logo from '../../images/schemup_logo.png';
import SideBarSchema from '../../images/icons/SideBarSchema';
import SideBarMockData from '../../images/icons/SideBarMockData';
import SideBarDatasources from '../../images/icons/SideBarDatasources';
import SideBarLogout from '../../images/icons/SideBarLogout';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import newAppTab from '../../utils/newAppTab';
import SideBarToggleClose from '../../images/icons/SideBarToggleClose';
import SideBarToggleOpen from '../../images/icons/SideBarToggleOpen';
import routes from '../../routes';
import { toggleSideBar } from '../../redux/slice/app';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';

export const SIDEBAR_WIDTH = 280;

interface ItemProps {
  title: string;
  to: string;
  icon: any;
  selected: string;
  setSelected: any;
  theme: any;
}

const Item = ({ title, to, icon, selected, setSelected, theme }: ItemProps) => {
  const dispatch = useAppDispatch();
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const navigate = useNavigate();

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: theme.palette.grey[800],
        width: '90%',
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
      }}
      onClick={() => {
        setSelected(title);
        newAppTab(dispatch, title, to, tabs, navigate);
      }}
      icon={icon}
    >
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>
        <Link to={to} />
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          width={30}
          height={22}
          borderRadius={16}
          bgcolor={theme.palette.grey[100]}
        >
          <Typography variant="body2" color={theme.palette.grey[800]}>
            10
          </Typography>
        </Box>
      </Box>
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const sideBarOpen = useAppSelector((state) => state.app.sideBarOpen);
  const { activeUser } = useAppSelector((state) => state.activeUser);
  const dispatch = useAppDispatch();
  const [_, setSelected] = useState('Schema');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logOutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        return navigate(routes.AUTH);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <Box
      borderRight={1}
      borderColor={theme.palette.grey[200]}
      sx={{
        '& .pro-sidebar-inner': {
          background: `${'#FFF'} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 20px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: `${theme.palette.primary.dark} !important`,
        },
        '& .pro-menu-item.active': {
          color: `${theme.palette.grey[800]} !important`,
          bgcolor: `${theme.palette.grey[100]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={!sideBarOpen} width={SIDEBAR_WIDTH}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <Box>
            {sideBarOpen && (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" pl={4} pr={3}>
                  {/* <Box display={'flex'} alignItems={'center'}>
                    <img src={logo} alt="SchemupLogo" />
                  </Box> */}
                  <Typography variant="h5" color={theme.palette.grey[900]} fontWeight="medium">
                    SchemeUp
                  </Typography>
                  <IconButton onClick={() => dispatch(toggleSideBar())}>
                    <SideBarToggleClose />
                  </IconButton>
                </Box>
              </Box>
            )}

            <MenuItem
              onClick={() => dispatch(toggleSideBar())}
              icon={!sideBarOpen ? <SideBarToggleOpen /> : undefined}
              style={{
                margin: '10px 0 20px 0',
                color: theme.palette.grey[100],
              }}
            ></MenuItem>
          </Box>

          {/* NAV ITEMS */}
          <Box mt={5} alignItems={'center'} justifyContent={'center'} display={'flex'} flexDirection={'column'}>
            <Item
              theme={theme}
              title="Schema"
              to={routes.HOME}
              icon={<SideBarSchema />}
              selected={pathname === '/' || pathname.includes(routes.SCHEMA) ? 'Schema' : ''}
              setSelected={setSelected}
            />

            <Item
              theme={theme}
              title="Mock Data"
              to={routes.MOCK_DATA}
              icon={<SideBarMockData />}
              selected={pathname.includes(routes.MOCK_DATA) ? 'Mock Data' : ''}
              setSelected={setSelected}
            />

            <Item
              theme={theme}
              title="DataSources"
              to={routes.DATASOURCES}
              icon={<SideBarDatasources />}
              selected={pathname.includes(routes.DATASOURCES) ? 'DataSources' : ''}
              setSelected={setSelected}
            />
          </Box>
        </Menu>

        <Box display={'flex'} flex={1} />

        {/* PROFILE SECTION */}
        <Box width={'90%'} height={1.1} bgcolor={theme.palette.divider} alignSelf={'center'} />
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} pl={2} pr={2} pb={8} pt={2}>
          <Avatar style={{ width: 30, height: 30, borderRadius: 15 }} />

          {!sideBarOpen ? undefined : (
            <>
              <Box>
                <Typography fontSize={14} fontWeight={500} color={theme.palette.grey[800]}>
                  {activeUser.name}
                </Typography>
                <Typography fontSize={14} fontWeight={400} color={theme.palette.grey[800]}>
                  {activeUser.email}
                </Typography>
              </Box>

              <IconButton onClick={logOutHandler}>
                <SideBarLogout />
              </IconButton>
            </>
          )}
        </Box>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
