import React from 'react';
import { makeStyles } from '@mui/styles';
import { IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  controlButton: {
    marginLeft: 1,
    border: "1px solid #EAECF0",
    borderRadius: 5,
  },
  emphasize: {
    fontWeight: 500,
  },
}));

const PageController = ({ currentPage, totalPages, onPageChange }: any) => {
  const classes = useStyles();

  const handlePageChange = (newPage: any) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  return (
    <div className={classes.root}>
      <IconButton
        className={classes.controlButton}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography mx={2}>
        Page <span className={classes.emphasize}>{currentPage}</span> of <span className={classes.emphasize}>{totalPages}</span>
      </Typography>
      <IconButton
        className={classes.controlButton}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ArrowForwardIcon />
      </IconButton>
    </div>
  );
};

export default PageController;
