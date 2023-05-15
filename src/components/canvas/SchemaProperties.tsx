import { Typography, Box, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import React from 'react';
import SideBarToggleOpen from '../../images/icons/SideBarToggleOpen';

interface SchemaPropertiesProps {
  toggleOpen: (open: boolean) => void;
}

const SchemaProperties = ({ toggleOpen }: SchemaPropertiesProps) => {
  return (
    <Box pl={2} pr={2} width={'100%'} pt={2}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography fontSize={16} fontWeight={600} color={'#344054'}>
          SCHEMA PROPERTIES
        </Typography>
        <IconButton onClick={() => toggleOpen(false)}>
          <SideBarToggleOpen color="#667085" />
        </IconButton>
      </Box>

      <Accordion
        disableGutters
        elevation={0}
        sx={{
          border: `1px solid white`,
          '&:not(:last-child)': {
            borderBottom: 0,
          },
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary>
          <Typography>Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p>test</p>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SchemaProperties;
