import 'react-pro-sidebar/dist/css/styles.css';
import { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';

import { tokens } from '../../theme';
import logo from '../../images/schemup_logo.png';
import SideBarSchema from '../../images/icons/SideBarSchema';
import SideBarMockData from '../../images/icons/SideBarMockData';
import SideBarDatasources from '../../images/icons/SideBarDatasources';
import SideBarLogout from '../../images/icons/SideBarLogout';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import newAppTab from '../../utils/newAppTab';
import { resetTabs } from '../../redux/slice/apptabs';

const Item = ({ title, to, icon, selected, setSelected }: any) => {
  const dispatch = useAppDispatch();
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const navigate = useNavigate();
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: '#101828',
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
        <Typography variant="h5" fontWeight={500}>
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
          bgcolor={'#F2F4F7'}
        >
          <Typography variant="h6" color={'#344054'}>
            10
          </Typography>
        </Box>
      </Box>
    </MenuItem>
  );
};

const Sidebar = () => {
  const colors = tokens();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [_, setSelected] = useState('Schema');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const tabs = useAppSelector((state) => state.appTabs.tabs);

  return (
    <Box
      borderRight={1}
      borderColor={colors.grey[900]}
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
          color: `${colors.primary[800]} !important`,
        },
        '& .pro-menu-item.active': {
          color: '#101828 !important',
          bgcolor: '#F9FAFB !important',
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} width={280}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <Box>
            {!isCollapsed && (
              <Box
                onClick={() => {
                  newAppTab(dispatch, 'Schema', '/', tabs, navigate);
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" pl={4} pr={3}>
                  <Box display={'flex'} alignItems={'center'}>
                    <img src={logo} alt="SchemupLogo" />
                  </Box>
                  <Typography variant="h4" color={colors.grey[100]} fontWeight="medium">
                    SchemeUp
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOpenRoundedIcon style={{ width: 30, height: 30 }} />
                  </IconButton>
                </Box>
              </Box>
            )}

            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOpenRoundedIcon style={{ width: 30, height: 30 }} /> : undefined}
              style={{
                margin: '10px 0 20px 0',
                color: colors.grey[100],
              }}
            ></MenuItem>
          </Box>

          <Box mt={5} alignItems={'center'} justifyContent={'center'} display={'flex'} flexDirection={'column'}>
            <Item
              title="Schema"
              to="/"
              icon={<SideBarSchema />}
              selected={pathname === '/' ? 'Schema' : undefined}
              setSelected={setSelected}
            />

            <Item
              title="Mock Data"
              to="/mock-data"
              icon={<SideBarMockData />}
              selected={pathname.includes('/mock-data') ? 'Mock Data' : undefined}
              setSelected={setSelected}
            />

            <Item
              title="DataSources"
              to="/datasources"
              icon={<SideBarDatasources />}
              selected={pathname.includes('/datasources') ? 'DataSources' : undefined}
              setSelected={setSelected}
            />
          </Box>
        </Menu>

        <Box display={'flex'} flex={1} />

        {/* PROFILE SECTION */}
        <Box width={'90%'} height={1.1} bgcolor={'#EAECF0'} alignSelf={'center'} />
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} pl={2} pr={2} pb={8} pt={2}>
          <Avatar />

          {isCollapsed ? undefined : (
            <>
              <Box>
                <Typography fontSize={14} fontWeight={500} color={'#344054'}>
                  Jacques Ikot
                </Typography>
                <Typography fontSize={14} fontWeight={400} color={'#344054'}>
                  jacquesikot@gmail.com
                </Typography>
              </Box>

              <IconButton>
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
