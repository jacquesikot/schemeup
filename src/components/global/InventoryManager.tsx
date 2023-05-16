import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Checkbox from '@mui/material/Checkbox';
//import SchemaCardItem from '../../images/icons/schema/SchemaCardItem';


const InventoryManager = () => {
  return (
    <Box
      sx={{
        width: 343,
        height: 174,
        background: '#FFFFFF',
        border: '1px solid #EAECF0',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '16px',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: 60,
          background: '#EAECF0',
          border: '1px solid #EAECF0',
          borderRadius: '12px 12px 0px 0px',
          padding: '16px 20px 16px 16px',
          gap: '4px',
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            left: -2,
            top: -2,
            background: '#F4EBFF',
            mixBlendMode: 'multiply',
            border: '4px solid #F9F5FF',
            borderRadius: '28px',
            position: 'relative',
          }}
        >
          <Checkbox
            sx={{
              position: 'absolute',
              width: 16,
              height: 16,
              left: 8,
              top: 8,
            }}
            icon={
              <span
                style={{ width: 16, height: 16, border: '1.33333px solid #7F56D9' }}
              />
            }
            checkedIcon={
              <span
                style={{ width: 16, height: 16, border: '1.33333px solid #7F56D9' }}
              />
            }
            
          />
        </Box>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Inventory_Manager
        </Typography>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: 28,
          gap: '16px',
        }}
      >
        {/* Content */}
      </Box>
    </Box>
  );
};

export default InventoryManager;
