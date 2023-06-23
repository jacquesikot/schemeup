import { Box, IconButton, MenuItem, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';

import SchemaCardIcon from '../../images/icons/schema/SchemaCardIcon';
import ThreeDotsV from '../../images/icons/ThreeDotsV';
import MenuPopper from '../global/MenuPopper';
import EditIcon from '../../images/icons/EditIcon';
import SchemaButtonUpload from '../../images/icons/schema/SchemaButtonUpload';
import TrashIconPlain from '../../images/icons/TrashIconPlain';
import routes from '../../routes';
import useAppTab from '../../hooks/useAppTab';
import { useAppSelector } from '../../redux/hooks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.config';
import { Role } from '../../redux/slice/schemas';

interface SchemaCardItemProps {
  id: string;
  title: string;
  description: string;
  noOfTables: string;
  hasUnsavedChanges?: boolean;
  handleDelete: () => void;
  isShared: boolean;
}

const SchemaCardItem = ({
  id,
  title,
  description,
  noOfTables,
  handleDelete,
  hasUnsavedChanges,
  isShared,
}: SchemaCardItemProps) => {
  const theme = useTheme();
  const colors = theme.palette;
  const { newAppTab } = useAppTab();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const schemas = useAppSelector((state) => state.schemas.schemas);
  const activeSchema = schemas.find((schema) => schema.id === id);
  const [user] = useAuthState(auth);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const returnUserRole = () => {
    if (user?.uid === activeSchema?.userId) {
      return Role.Admin;
    }

    const userData = activeSchema && activeSchema.users && activeSchema?.users.find((u) => u.email === user!.email);

    return userData?.role || Role.Viewer;
  };
  return (
    <Box
      width={343}
      height={174}
      py={'6px'}
      border={1}
      borderRadius={'12px'}
      borderColor={'#EAECF0'}
      sx={{ whiteSpace: 'wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
    >
      <Box
        borderBottom={1}
        borderColor={'#EAECF0'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        p={'8px 14px 14px 14px'}
      >
        <Box display={'flex'} alignItems={'center'}>
          <SchemaCardIcon />

          <Box>
            <Typography fontSize={16} fontWeight={500} marginLeft={'14px'} noWrap>
              {title}
            </Typography>
            <Box display={'flex'} alignItems={'center'}>
              <Typography
                fontSize={12}
                fontWeight={500}
                marginLeft={'14px'}
                noWrap
                color={hasUnsavedChanges ? colors.warning.main : colors.success.main}
              >
                {hasUnsavedChanges ? 'Unsaved changes' : 'Up to date'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <IconButton
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? 'composition-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <ThreeDotsV />
          </IconButton>

          <MenuPopper
            open={open}
            setOpen={setOpen}
            anchorRef={anchorRef}
            handleClose={handleClose}
            containerStyle={{ border: '1px solid #EAECF0', width: '115px', borderRadius: '6px' }}
            menuItems={
              <>
                <MenuItem
                  style={menuItemStyle}
                  onClick={() => {
                    newAppTab(`${routes.EDIT_SCHEMA}/${id}`);
                  }}
                >
                  <EditIcon />
                  <Typography color={'#344054'} fontSize={14} fontWeight={600} ml={1}>
                    {returnUserRole() === Role.Admin || returnUserRole() === Role.Editor ? 'Edit' : 'View'}
                  </Typography>
                </MenuItem>
                <MenuItem style={menuItemStyle} onClick={handleClose}>
                  <SchemaButtonUpload />
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    Export
                  </Typography>
                </MenuItem>
                {user!.uid === activeSchema?.userId && (
                  <MenuItem
                    style={menuItemStyle}
                    onClick={(e) => {
                      handleDelete();
                      handleClose(e);
                    }}
                  >
                    <TrashIconPlain />
                    <Typography color={'#F04438'} fontSize={14} fontWeight={500} ml={1}>
                      Delete
                    </Typography>
                  </MenuItem>
                )}
              </>
            }
          />
        </Box>
      </Box>

      <Box pl={'14px'} pr={'14px'} pb={'14px'} pt={'5px'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'flex-end'}>
            <Typography fontSize={30} fontWeight={600} color={'#344054'} mr={0.5}>
              {noOfTables}
            </Typography>
            <Typography mb={1}>tables</Typography>
          </Box>

          {isShared && (
            <Box
              height={18}
              display={'flex'}
              borderRadius={1}
              justifyContent={'center'}
              alignItems={'center'}
              paddingLeft={1}
              paddingRight={1}
              bgcolor={colors.success.light}
            >
              <Typography fontSize={10} fontWeight={500} color={colors.success.main}>
                Shared
              </Typography>
            </Box>
          )}
        </Box>

        <Box>
          <Typography fontSize={'14px'} color={'#475467'} className="truncate">
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SchemaCardItem;
