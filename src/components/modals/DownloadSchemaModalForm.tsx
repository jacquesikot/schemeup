import { Grid, FormControl, RadioGroup, FormControlLabel, Radio, List, ListItem, ListItemText, ListItemIcon, ListItemButton, ThemeProvider, createTheme, ListItemSecondaryAction, Link } from '@mui/material';
import PostgresIcon from '../../images/icons/PostgresIcon';
import CsvIcon from '../../images/icons/CsvIcon';
import MongoDbIcon from '../../images/icons/MongoDbIcon';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setDownloadFormat, setSelectedFormat } from '../../redux/slice/settings';

enum Database { "sql" = "SQL", "csv" = "CSV", "mongo" = "MongoDB" }

const DownloadSchemaModalForm = () => {
  const { downloadFormat } = useAppSelector((state) => state.settings.defaults);
  const { selectedFormat } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const changeFormatHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    dispatch(setSelectedFormat(value));
  }


  return (
    <FormControl sx={{ mt: 0.7, width: "100%" }}>
      <RadioGroup
        aria-labelledby="schema-download-format"
        name="download-format-radio"
        value={selectedFormat}
        onChange={changeFormatHandler}
      >
        <ThemeProvider theme={createTheme({
          components: {
            MuiListItem: { defaultProps: { disablePadding: true } },
            MuiListItemButton: { defaultProps: { disableTouchRipple: true, disableGutters: false } }
          }
        })}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <List dense>
                <ListItem component="div" sx={{ border: "1px solid #EAECF0", borderRadius: "20px", pr: "10px", my: "10px" }}>
                  <ListItemButton selected={selectedFormat === Database.sql ? true : false}
                    onClick={() => {
                      dispatch(setDownloadFormat(Database.sql));
                    }}>
                    <ListItemIcon>
                      <PostgresIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={Database.sql}
                      secondary={downloadFormat === Database.sql ? "Default" : "Click to set as default"}
                    />
                  </ListItemButton>
                  <FormControlLabel value={Database.sql} control={<Radio />} label labelPlacement="start" sx={{ ml: "0px", px: "8px" }} />
                </ListItem>

                <ListItem component="div" sx={{ border: "1px solid #EAECF0", borderRadius: "20px", pr: "10px", my: "10px" }}>
                  <ListItemButton selected={selectedFormat === Database.csv ? true : false}
                    onClick={() => {
                      dispatch(setDownloadFormat(Database.csv));
                    }}>
                    <ListItemIcon>
                      <CsvIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={Database.csv}
                      secondary={downloadFormat === Database.csv ? "Default" : "Click to set as default"}
                    />
                  </ListItemButton>
                  <FormControlLabel value={Database.csv} control={<Radio />} label labelPlacement="start" sx={{ ml: "0px", px: "8px" }} />
                </ListItem>

                <ListItem component="div" sx={{ border: "1px solid #EAECF0", borderRadius: "20px", pr: "10px", my: "10px" }}>
                  <ListItemButton selected={selectedFormat === Database.mongo ? true : false}
                    onClick={() => {
                      dispatch(setDownloadFormat(Database.mongo));
                    }}>
                    <ListItemIcon>
                      <MongoDbIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={Database.mongo}
                      secondary={downloadFormat === Database.mongo ? "Default" : "Click to set as default"}
                    />
                  </ListItemButton>
                  <FormControlLabel value={Database.mongo} control={<Radio />} label labelPlacement="start" sx={{ ml: "0px", px: "8px" }} />
                </ListItem>

              </List>
            </Grid>
          </Grid>
        </ThemeProvider>
      </RadioGroup>
    </FormControl >
  );
};

export default DownloadSchemaModalForm;
