import { useEffect, useRef } from 'react';
import { Box, IconButton, MenuItem, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import TopTabItem from '../TopTabItem';
import TopBarPlus from '../../images/icons/Plus';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import newAppTab from '../../utils/newAppTab';
import { Tab } from '../../redux/slice/apptabs';
import generateSchemaName from '../../utils/generateSchemaName';
import MenuPopper from './MenuPopper';
import routes from '../../routes';
import { newSchema } from '../../redux/slice/schemas';

interface TopBarProps {
  items: Tab[];
}

const menuItemStyle = {
  height: '55px',
};

export default function Topbar({ items }: TopBarProps) {
  const theme = useTheme();
  const colors = theme.palette;
  const { pathname } = useLocation();
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [boxSize, setBoxSize] = useState(70);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const topBarRef = useRef<any>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const resizeBoxes = () => {
      if (!topBarRef.current) return;

      const containerWidth = topBarRef.current.clientWidth;
      const containerHeight = topBarRef.current.clientHeight;
      const numBoxes = tabs.length;

      if (numBoxes > 0) {
        const boxSize = Math.min(containerWidth / numBoxes, containerHeight);
        setBoxSize(boxSize);
      }
    };

    resizeBoxes();

    window.addEventListener('resize', resizeBoxes);
    return () => {
      window.removeEventListener('resize', resizeBoxes);
    };
  }, [tabs.length, topBarRef]);

  return (
    <Box
      ref={topBarRef}
      display={'flex'}
      alignItems={'center'}
      height={44}
      maxWidth={'100%'}
      bgcolor={'red'}
      borderBottom={1}
      borderColor={colors.grey[200]}
      sx={{
        overflow: 'hidden',
      }}
    >
      {items.map((i, index) => (
        <TopTabItem
          key={index}
          active={i.route === pathname ? true : false}
          title={i.title}
          index={index}
          tabs={tabs}
          width={boxSize}
          meta={i.meta}
        />
      ))}

      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        width={50}
        height={'100%'}
        bgcolor={colors.primary.light}
      >
        <IconButton
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <TopBarPlus color={theme.palette.primary.main} />
        </IconButton>

        <MenuPopper
          open={open}
          setOpen={setOpen}
          anchorRef={anchorRef}
          handleClose={handleClose}
          containerStyle={{ border: `1px solid ${theme.palette.divider}`, width: '200px', borderRadius: '6px' }}
          menuItems={
            <>
              <MenuItem
                style={menuItemStyle}
                onClick={(e) => {
                  const id = uuidv4();
                  const newSchemaName = generateSchemaName();
                  newAppTab(dispatch, `Schema - ${newSchemaName}`, `${routes.EDIT_SCHEMA}/${id}`, tabs, navigate, {
                    id,
                  });
                  dispatch(newSchema({ id, title: newSchemaName, tables: [] }));
                  handleClose(e);
                }}
              >
                <Typography color={theme.palette.grey[700]} fontSize={14} fontWeight={600}>
                  New Schema
                </Typography>
              </MenuItem>
              <MenuItem style={menuItemStyle} onClick={handleClose}>
                <Typography color={theme.palette.grey[700]} fontSize={14} fontWeight={500}>
                  New Mock Dataset
                </Typography>
              </MenuItem>
              <MenuItem style={menuItemStyle} onClick={handleClose}>
                <Typography color={theme.palette.grey[700]} fontSize={14} fontWeight={500}>
                  New Database
                </Typography>
              </MenuItem>
            </>
          }
        />
      </Box>
    </Box>
  );
}
