import { useEffect, useState } from 'react';
import { Typography, Box, IconButton, TextField, styled, Checkbox, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';

import SideBarToggleOpen from '../../images/icons/SideBarToggleOpen';
import Switch from '../Switch';
import Button from '../global/Button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateSchema } from '../../redux/slice/schemas';
import AiSuggestCard from './AiSuggestCard';
import SchemaTemplateCard from '../SchemaTemplateCard';
import TableV2 from './TableV2';
import { triggerSnack } from '../../redux/slice/app';

interface SchemaPropertiesProps {
  toggleOpen: (open: boolean) => void;
  showRelations: boolean;
  toggleRelations: (showRelations: boolean) => void;
  suggestions: { problem: string; suggestion: string; severity: 'high' | 'medium' | 'low' }[];
  suggestionLoading: boolean;
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
  suggestionLoading,
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
      setActiveSuggestions(
        suggestions.filter((s) => s.suggestion.toLowerCase().includes(activeTableName.toLowerCase()))
      );
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
          <Grid
            container
            maxHeight={'65vh'}
            pb={2}
            display={'flex'}
            justifyContent={'center'}
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
            </Grid>
          </Grid>
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
                    dispatch(
                      triggerSnack({
                        message: 'Schema description updated',
                        severity: 'success',
                        hideDuration: 2000,
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
                <Typography variant="body2" fontWeight={500} fontSize={14} color={colors.grey[600]}>
                  Hide Table Columns
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'}>
                <Checkbox checked={!showRelations} onChange={(e) => toggleRelations(!showRelations)} />
                <Typography variant="body2" fontWeight={500} fontSize={14} color={colors.grey[600]}>
                  Hide Relations
                </Typography>
              </Box>
            </Box>
          </>
        )
      ) : (
        <>
          <Typography mt={2}>{schema.activeTable ? `Filtering for ${activeTableName}` : 'Entire Schema'}</Typography>
          {suggestionLoading ? (
            <Player src={require('../../images/animation/ai-loading.json')} loop autoplay />
          ) : (
            <>
              <Grid
                container
                maxHeight={'80%'}
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
                {suggestions.map((s) => (
                  <Grid>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                      <AiSuggestCard
                        question={s.problem}
                        solutions={[
                          {
                            header: 'Suggested Solution',
                            body: s.suggestion,
                            onPressFixNow: () => console.log('fixed'),
                            onPressLearnMore: () => console.log('learn'),
                          },
                        ]}
                        severity={s.severity}
                        onPressInfo={() => console.log('info')}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default SchemaProperties;
