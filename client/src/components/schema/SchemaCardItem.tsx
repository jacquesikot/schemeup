import { Box, IconButton, MenuItem, Typography } from '@mui/material';
import SchemaCardIcon from '../../images/icons/schema/SchemaCardIcon';
import ThreeDotsV from '../../images/icons/ThreeDotsV';
import MenuPopper from '../global/MenuPopper';
import { useRef, useState } from 'react';
import EditIcon from '../../images/icons/EditIcon';
import SchemaButtonUpload from '../../images/icons/schema/SchemaButtonUpload';
import TrashIconPlain from '../../images/icons/TrashIconPlain';
import newAppTab from '../../utils/newAppTab';
import routes from '../../routes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';

interface SchemaCardItemProps {
  id: string;
  title: string;
  description: string;
  noOfTables: string;
  handleDelete: () => void;
}

const SchemaCardItem = ({ id, title, description, noOfTables, handleDelete }: SchemaCardItemProps) => {
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

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
  return (
    <Box width={343} height={174} border={1} borderRadius={'12px'} borderColor={'#EAECF0'}>
      <Box
        borderBottom={1}
        borderColor={'#EAECF0'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        p={'14px'}
      >
        <Box display={'flex'} alignItems={'center'}>
          <SchemaCardIcon />

          <Typography fontSize={16} fontWeight={500} marginLeft={'14px'} noWrap>
            {title}
          </Typography>
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
                    newAppTab(dispatch, `Schema - ${title}`, `${routes.EDIT_SCHEMA}/${id}`, tabs, navigate, { id });
                  }}
                >
                  <EditIcon />
                  <Typography color={'#344054'} fontSize={14} fontWeight={600} ml={1}>
                    Edit
                  </Typography>
                </MenuItem>
                <MenuItem style={menuItemStyle} onClick={handleClose}>
                  <SchemaButtonUpload />
                  <Typography color={'#344054'} fontSize={14} fontWeight={500} ml={1}>
                    Export
                  </Typography>
                </MenuItem>
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
              </>
            }
          />
        </Box>
      </Box>

      <Box pl={'14px'} pr={'14px'} pb={'14px'} pt={'5px'}>
        <Box display={'flex'} alignItems={'flex-end'}>
          <Typography fontSize={30} fontWeight={600} color={'#344054'} mr={0.5}>
            {noOfTables}
          </Typography>
          <Typography mb={1}>tables</Typography>
        </Box>

        <Typography fontSize={'14px'} color={'#475467'}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default SchemaCardItem;
