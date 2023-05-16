import { useEffect, useRef } from 'react';
import { Box, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material';

import TopTabItem from '../TopTabItem';
import { tokens } from '../../theme';
import TopBarPlus from '../../images/icons/Plus';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useState } from 'react';
import newAppTab from '../../utils/newAppTab';
import { Tab } from '../../redux/slice/apptabs';
import generateSchemaName from '../../utils/generateSchemaName';

interface TopBarProps {
  items: Tab[];
}

export default function Topbar({ items }: TopBarProps) {
  const colors = tokens();
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

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

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
      borderColor={colors.grey[900]}
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
        />
      ))}

      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        width={50}
        height={'100%'}
        bgcolor={colors.primary[50]}
      >
        <IconButton
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <TopBarPlus />
        </IconButton>
        {/* TODO: EXTRPOLATE THIS INTO A HIGHER COMPONENT THAT CAN BE USED IN OTHER PLACES */}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          style={{ zIndex: 1000 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={(e) => {
                        const newSchemaName = generateSchemaName();
                        newAppTab(
                          dispatch,
                          `Schema - ${newSchemaName}`,
                          `/schema/new/${newSchemaName}`,
                          tabs,
                          navigate
                        );
                        handleClose(e);
                      }}
                    >
                      <Typography color={'#101828'} fontSize={16} fontWeight={500}>
                        Schema
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Typography color={'#101828'} fontSize={16} fontWeight={500}>
                        Mock Dataset
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Typography color={'#101828'} fontSize={16} fontWeight={500}>
                        Database
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Box>
  );
}
