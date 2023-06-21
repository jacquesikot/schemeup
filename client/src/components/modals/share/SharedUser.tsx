import { useState, useRef, useEffect } from 'react';
import { Avatar, Button as MuiButton, Grid, ListItem, MenuItem, Typography } from "@mui/material";
import MenuPopper from "../../global/MenuPopper";
import { Role, SchemaUser, removeSchemaUsers, updateSchemaUser } from '../../../redux/slice/schemas';
import { useAppDispatch } from '../../../redux/hooks';
import Button from '../../global/Button';

interface UserProps extends SchemaUser {
  schemaId: string;
  image?: string;
}

const SharedUser = ({ name, email, role, image, schemaId }: UserProps) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [accessControl, setAccessControl] = useState<Role>(role);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
  };
  let userInitials = "";

  if (name.includes("@")) {
    userInitials = name[0].toUpperCase();
  } else {
    const user = name.split(" ");
    userInitials = user[0][0] + user[1][0];
  }

  // Toggle Menu Popper for Edit/View
  const handleToggle = () => {
    setOpenMenu((prevValue) => !prevValue);
  };
  // Once the Popper menu is open, always update the permission type on close or click of an option
  const handleMenuClose = (permission: Role, event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setAccessControl(permission);
    setOpenMenu(false);
  };

  const removeUserFromList = () => {
    dispatch(removeSchemaUsers({ schemaId, users: [{ name, email, role }] }));
  }

  useEffect(() => {
    dispatch(updateSchemaUser({ schemaId, user: { name, email, role: accessControl } }))
  }, [accessControl])


  return (
    <ListItem disableGutters>
      <Grid container spacing={0.8} direction={"row"} alignItems={"center"}>
        <Grid item xs={1.6}>
          <Avatar alt={name} src={image}>{userInitials}</Avatar>
        </Grid>
        <Grid item xs={5.4}>
          <Typography variant="subtitle1" fontWeight={600} fontSize={15} lineHeight={1.2}>{name}</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>{email}</Typography>
        </Grid>
        <Grid item xs={2.5}>
          <MuiButton
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
          </MuiButton>

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
                  onClick={handleMenuClose.bind(null, Role.Viewer)}
                >
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    Viewer
                  </Typography>
                </MenuItem>
                <MenuItem
                  disableRipple
                  style={menuItemStyle}
                  onClick={handleMenuClose.bind(null, Role.Editor)}
                >
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    Editor
                  </Typography>
                </MenuItem>
                <MenuItem
                  disableRipple
                  style={menuItemStyle}
                  onClick={handleMenuClose.bind(null, Role.Admin)}
                >
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    Admin
                  </Typography>
                </MenuItem>
              </>
            }
          />
        </Grid>
        <Grid item xs={2.5}>
          <Button
            disableRipple={false}
            label="Remove"
            type="error"
            onClick={removeUserFromList}
            style={{
              textTransform: "capitalize",
              fontSize: 14,
              fontWeight: 600,
              padding: 2,
              background: "none",
              color: "#D92D20",
              border: "none",
            }}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default SharedUser;