import { ClickAwayListener, Grow, MenuList, Paper, Popper } from '@mui/material';
import { ReactNode } from 'react';

interface MenuPopperProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorRef: React.RefObject<HTMLButtonElement>;
  handleClose: (event: Event | React.SyntheticEvent) => void;
  menuItems: ReactNode;
  containerStyle?: React.CSSProperties;
}

const MenuPopper = ({ open, anchorRef, handleClose, setOpen, menuItems, containerStyle }: MenuPopperProps) => {
  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
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
          <Paper elevation={0} style={containerStyle}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="composition-button"
                onKeyDown={handleListKeyDown}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {menuItems}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default MenuPopper;
