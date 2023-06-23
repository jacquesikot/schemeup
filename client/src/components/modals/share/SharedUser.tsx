import { useState, useRef, useEffect } from 'react';
import { Avatar, Button as MuiButton, Grid, ListItem, MenuItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import MenuPopper from '../../global/MenuPopper';
import { Role, SchemaUser, removeSchemaUsers, updateSchemaUser } from '../../../redux/slice/schemas';
import { useAppDispatch } from '../../../redux/hooks';
import Button from '../../global/Button';

interface UserProps extends SchemaUser {
  schemaId: string;
  image?: string;
}

const SharedUser = ({ name, email, role, image, schemaId }: UserProps) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const theme = useTheme();
  const colors = theme.palette;
  const [accessControl, setAccessControl] = useState<Role>(role);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  function getInitials(str: string) {
    // Split the string into words
    const words = str.split(' ');

    // If there are two or more words, get the first character from the first two words
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    // If there's only one word, get the first character from that word
    else if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    // If the string is empty or doesn't contain any words, return an empty string
    else {
      return '';
    }
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
  };

  useEffect(() => {
    dispatch(updateSchemaUser({ schemaId, user: { name, email, role: accessControl } }));
  }, [accessControl, dispatch, email, name, schemaId]);

  return (
    <ListItem disableGutters>
      <Grid container spacing={0.8} direction={'row'} alignItems={'center'}>
        <Grid item xs={1.6}>
          <Avatar alt={name} src={image}>
            {getInitials(name)}
          </Avatar>
        </Grid>
        <Grid item xs={5.4}>
          <Typography fontStyle={'14px'} color={colors.grey[700]} fontWeight={600} fontSize={15} lineHeight={1.2}>
            {name}
          </Typography>
          <Typography color={colors.grey[600]} fontWeight={400} fontSize={'14px'}>
            {email}
          </Typography>
        </Grid>
        <Grid item xs={2.5}>
          <MuiButton
            ref={anchorRef}
            id="composition-button"
            aria-controls={openMenu ? 'composition-menu' : undefined}
            aria-expanded={openMenu ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            sx={{
              color: 'GrayText',
              textTransform: 'capitalize',
              fontSize: 14,
              '&:hover': { backgroundColor: 'transparent', fontWeight: 600 },
            }}
            disableRipple
          >
            {accessControl}
          </MuiButton>

          {/* Menu */}
          <MenuPopper
            open={openMenu}
            setOpen={() => {}}
            anchorRef={anchorRef}
            handleClose={handleMenuClose.bind(null, accessControl)}
            containerStyle={{ border: '1px solid #EAECF0', width: '115px', borderRadius: '6px' }}
            menuItems={
              <>
                <MenuItem disableRipple style={menuItemStyle} onClick={handleMenuClose.bind(null, Role.Viewer)}>
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    Viewer
                  </Typography>
                </MenuItem>
                <MenuItem disableRipple style={menuItemStyle} onClick={handleMenuClose.bind(null, Role.Editor)}>
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    Editor
                  </Typography>
                </MenuItem>
                <MenuItem disableRipple style={menuItemStyle} onClick={handleMenuClose.bind(null, Role.Admin)}>
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
              textTransform: 'capitalize',
              fontSize: 14,
              fontWeight: 600,
              padding: 2,
              background: 'none',
              color: '#D92D20',
              border: 'none',
            }}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default SharedUser;
