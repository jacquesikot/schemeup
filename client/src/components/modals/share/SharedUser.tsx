import { useState, useRef } from 'react';
import { Avatar, Button, Grid, ListItem, MenuItem, Typography } from "@mui/material";
import MenuPopper from "../../global/MenuPopper";
import { appColors } from '../BaseModal';

type ACType = 'Edit' | 'View';

interface UserProps {
  name: string;
  email: string;
  image: string;
}

const SharedUser = ({ name, email, image }: UserProps) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [accessControl, setAccessControl] = useState<ACType>("Edit");
  const anchorRef = useRef<HTMLButtonElement>(null);
  const user = name.split(" ");
  const userInitials = user[0][0] + user[1][0];

  // Toggle Menu Popper for Edit/View
  const handleToggle = () => {
    setOpenMenu((prevValue) => !prevValue);
  };
  // Once the Popper menu is open, always update the permission type on close or click of an option
  const handleMenuClose = (permission: ACType, event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setAccessControl(permission);
    setOpenMenu(false);
  };

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <ListItem disableGutters>
      <Grid container spacing={0.8} direction={"row"} justifyContent={"space-evenly"} alignItems={"center"}>
        <Grid item>
          <Avatar alt={name} src={image}>{userInitials}</Avatar>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" fontWeight={600} fontSize={15} lineHeight={1.2}>{name}</Typography>
          <Typography variant="subtitle2" sx={{fontWeight:400}}>{email}</Typography>
        </Grid>
        <Grid item>
          <Button
            ref={anchorRef}
            id="composition-button"
            aria-controls={openMenu ? 'composition-menu' : undefined}
            aria-expanded={openMenu ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            sx={{ color: "GrayText", textTransform: "capitalize", fontSize: 14, "&:hover": { backgroundColor: "transparent", fontWeight: 600 } }}
            disableRipple
          >
            {accessControl}
          </Button>

          {/* Menu */}
          <MenuPopper
            open={openMenu}
            setOpen={() => { }}
            anchorRef={anchorRef}
            handleClose={handleMenuClose.bind(null, accessControl)}
            containerStyle={{ border: '1px solid #EAECF0', width: '115px', borderRadius: '6px' }}
            menuItems={
              <>
                <MenuItem
                  disableRipple
                  style={menuItemStyle}
                  onClick={handleMenuClose.bind(null, 'View')}
                >
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    View
                  </Typography>
                </MenuItem>
                <MenuItem
                  disableRipple
                  style={menuItemStyle}
                  onClick={handleMenuClose.bind(null, 'Edit')}
                >
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    Edit
                  </Typography>
                </MenuItem>
              </>
            }
          />
        </Grid>
        <Grid item>
          <Button sx={{ color: appColors.error, textTransform: "capitalize", fontSize: 14, fontWeight: 600, "&:hover": { backgroundColor: "transparent", fontWeight: 700 } }}>Remove</Button>
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default SharedUser;