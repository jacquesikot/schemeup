import { Typography, Box, IconButton, TextField, styled, Checkbox, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import SideBarToggleOpen from '../../images/icons/SideBarToggleOpen';
import Switch from '../Switch';
import { useEffect, useState } from 'react';
import Button from '../global/Button';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editTable, updateSchema } from '../../redux/slice/schemas';
import AiSuggestCard from './AiSuggestCard';
import TableV2 from './TableV2';

interface SchemaPropertiesProps {
  toggleOpen: (open: boolean) => void;
  showRelations: boolean;
  toggleRelations: (showRelations: boolean) => void;
  suggestions: { title: string; body: string }[];
  handleTableDelete: () => void;
}

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    color: '#667085',
    fontSize: 16,
    height: 126,

    '& fieldset': {
      borderColor: '#E0E3E7',
      borderRadius: 8,
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6941C6',
    },
  },
});

const SchemaProperties = ({
  toggleOpen,
  showRelations,
  toggleRelations,
  suggestions,
  handleTableDelete,
}: SchemaPropertiesProps) => {
  const theme = useTheme();
  const colors = theme.palette;
  const params = useParams();
  const schema = useAppSelector(
    (state) => state.schemas.schemas.filter((s) => s.id === params.id)[0] || ({ name: '' } as any)
  );
  const activeTableArray =
    schema.activeTable && schema.tables ? schema.tables.filter((t) => t.id === schema.activeTable) : [];
  const activeTable = activeTableArray.length > 0 ? activeTableArray[0] : null;
  const activeTableName = activeTableArray.length > 0 ? activeTableArray[0].name : '';
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('Settings');
  const [description, setDescription] = useState(schema.description);
  const [activeSuggestions, setActiveSuggestions] = useState(suggestions);

  useEffect(() => {
    if (activeTableName) {
      setActiveSuggestions(suggestions.filter((s) => s.body.toLowerCase().includes(activeTableName.toLowerCase())));
    } else {
      setActiveSuggestions(suggestions);
    }
  }, [suggestions, activeTableName]);

  return (
    <Box pl={2} pr={2} width={'100%'} pt={2}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={3}>
        <Box>
          <Typography fontSize={18} fontWeight={600} color={colors.grey[900]}>
            Schema
          </Typography>
          <Typography fontSize={14} fontWeight={400} color={colors.grey[700]} mt={1}>
            Get more from your schema
          </Typography>
        </Box>

        <IconButton onClick={() => toggleOpen(false)}>
          <SideBarToggleOpen color={colors.grey[500]} />
        </IconButton>
      </Box>

      <Switch value={value} setValue={setValue} badgeValue={suggestions.length} />

      {value === 'Settings' ? (
        schema.activeTable && activeTable ? (
          <Box mt={3}>
            <TableV2
              data={{
                id: activeTable.id,
                title: activeTable.name,
                handleTableDelete,
                columns: activeTable.columns.map((c) => {
                  return {
                    name: c.name,
                    type: c.type,
                    primaryKey: c.primaryKey,
                    foreignKey: activeTable.foreignKeys.filter((fk: any) => fk.column === c.name).length > 0,
                    nullable: c.nullable,
                    index: c.index,
                    autoInc: c.autoInc,
                    autoUpdateTime: c.autoUpdateTime,
                    comment: '',
                    unique: c.unique,
                    default: '',
                  };
                }),
              }}
            />
          </Box>
        ) : (
          <>
            <Box>
              <Typography fontSize={14} fontWeight={500} color={colors.grey[900]} mt={3} mb={1}>
                Description
              </Typography>

              <StyledTextField
                multiline
                style={{ width: '100%' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Box display={'flex'} width={'100%'} justifyContent={'flex-end'} mb={5} mt={2}>
                <Button
                  type="primary"
                  label="Save"
                  onClick={() => {
                    dispatch(
                      updateSchema({
                        ...schema,
                        description,
                      })
                    );
                  }}
                />
              </Box>

              <Box display={'flex'} alignItems={'center'}>
                <Checkbox
                  checked={!schema.meta.showColumns || false}
                  onChange={(e) =>
                    dispatch(
                      updateSchema({
                        ...schema,
                        meta: {
                          ...schema.meta,
                          showColumns: !schema.meta.showColumns,
                        },
                      })
                    )
                  }
                />
                <Typography fontWeight={500} fontSize={14} color={colors.grey[700]}>
                  Hide Table Columns
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'}>
                <Checkbox checked={!showRelations} onChange={(e) => toggleRelations(!showRelations)} />
                <Typography fontWeight={500} fontSize={14} color={colors.grey[700]}>
                  Hide Relations
                </Typography>
              </Box>
            </Box>
          </>
        )
      ) : (
        <>
          <Typography mt={2}>{schema.activeTable ? `Filtering for ${activeTableName}` : 'Entire Schema'}</Typography>
          <Grid
            container
            maxHeight={'71vh'}
            pt={2}
            pb={2}
            sx={{
              overflowY: 'auto' /* To allow main grid scroll vertically but not entire screen */,
              scrollbarWidth: 'none' /* Firefox */,
              '-ms-overflow-style': 'none' /* IE 10+ */,
              '&::-webkit-scrollbar': {
                width: 0,
                height: 0,
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'transparent',
              },
              '-webkit-overflow-scrolling': 'touch' /* For hide on scroll */,
            }}
          >
            <Grid>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                {activeSuggestions &&
                  activeSuggestions.length > 0 &&
                  activeSuggestions.map((s, index) => <AiSuggestCard key={index} title={s.title} body={s.body} />)}
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SchemaProperties;
