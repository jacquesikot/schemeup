import { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleCodeEditor } from '../../redux/slice/app';
import { SIDEBAR_WIDTH } from './Sidebar';
import { CANVAS_DRAWER_WIDTH } from '../canvas/CanvasDrawer';
import { useLocation } from 'react-router-dom';
import routes from '../../routes';
import generateSchemaTablesSql from '../../utils/generateSchemaTablesSql';
import { CancelIcon } from '../../images/icons/CancelIcon';

const BOTTOM_BAR_HEIGHT = 44;

SyntaxHighlighter.registerLanguage('sql', sql);

const BottomBar = () => {
  const location = useLocation();
  const sideBarOpen = useAppSelector((state) => state.app.sideBarOpen);
  const codeEditorOpen = useAppSelector((state) => state.app.codeEditorOpen);
  const rightPanelOpen = useAppSelector((state) => state.app.rightPanelOpen);

  const urlParts = location.pathname.split('/');
  const id = urlParts[urlParts.length - 1];

  const schemaArr = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === id));

  const schema = schemaArr && schemaArr.length > 0 ? schemaArr[0] : { tables: [] };

  console.log(schema);

  const dispatch = useAppDispatch();

  const [boxHeight, setBoxHeight] = useState(500);
  const [boxBottom, setBoxBottom] = useState(BOTTOM_BAR_HEIGHT);
  const [schemaSql, setSchemaSql] = useState<string>('');

  const handleDrag = (e: any, { deltaY }: any) => {
    setBoxHeight((prevHeight) => prevHeight - deltaY);
    setBoxBottom((prevBottom) => prevBottom + deltaY);
  };

  const sqlAccessRoutes = location.pathname.includes(routes.EDIT_SCHEMA) || location.pathname.includes(routes.SHARE_SCHEMA);


  useEffect(() => {
    if (!location.pathname.includes(routes.EDIT_SCHEMA)) {
      dispatch(toggleCodeEditor());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (schema) {
      setSchemaSql(generateSchemaTablesSql(schema.tables as any));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema.tables]);

  const returnBoxWidth = () => {
    if (rightPanelOpen && sideBarOpen) {
      return `calc(100% - ${CANVAS_DRAWER_WIDTH + SIDEBAR_WIDTH}px)`;
    }
    if (rightPanelOpen) {
      return `calc(100% - ${CANVAS_DRAWER_WIDTH + 80}px)`;
    }
    if (sideBarOpen) {
      return `calc(100% - ${SIDEBAR_WIDTH}px)`;
    }
    return 'calc(100% - 80px)';
  };

  const BOX_WIDTH = returnBoxWidth();

  console.log(codeEditorOpen);

  return (
    <Box
      display={'flex'}
      position={'absolute'}
      bottom={0}
      bgcolor={'white'}
      height={BOTTOM_BAR_HEIGHT}
      zIndex={1100}
      width={'100%'}
      borderTop={1}
      borderColor={'divider'}
      alignItems={'center'}
      justifyContent={'space-between'}
      paddingX={2}
    >
      {codeEditorOpen && (
        // <Draggable axis="y" onDrag={handleDrag} allowAnyClick={false}>
        <Box
          position={'absolute'}
          minHeight={300}
          bgcolor={'white'}
          borderLeft={1}
          borderTop={1}
          borderColor={'divider'}
          height={boxHeight}
          width={BOX_WIDTH}
          bottom={boxBottom}
          left={sideBarOpen ? SIDEBAR_WIDTH : 80}
          sx={{
            transition: 'width 0.3s ease, left 0.3s ease',
          }}
        >
          <div
            style={{
              cursor: 'row-resize',
              height: '8px',
              width: '100%',
              position: 'absolute',
              top: '-4px',
            }}
          />

          <Box display={'flex'} alignItems={'center'} width={'100%'} justifyContent={'space-between'} p={'10px'}>
            <Typography fontSize={16}>SQL</Typography>

            <IconButton onClick={() => dispatch(toggleCodeEditor())}>
              <CancelIcon />
            </IconButton>
          </Box>

          <SyntaxHighlighter
            showLineNumbers
            wrapLongLines
            language="sql"
            style={a11yLight}
            customStyle={{
              width: '100%',
              // height: boxHeight,
              fontSize: 16,
              // backgroundColor: 'red',
            }}
            onMouseDown={(event: any) => {
              event.stopPropagation();
            }}
          >
            {schemaSql}
          </SyntaxHighlighter>
        </Box>
      )}

      <Typography fontSize={'14px'} fontWeight={500} color={'#475467'} letterSpacing={1}>
        v0.0.1
      </Typography>

      <Box display="flex">
        {sqlAccessRoutes && (
          <IconButton onClick={() => dispatch(toggleCodeEditor())}>
            <Typography color={'#101828'}>SQL</Typography>
          </IconButton>
        )}

        <Box
          display={'flex'}
          alignItems={'center'}
          bgcolor={'#ECFDF3'}
          borderRadius={12}
          paddingX={1}
          paddingY={0.5}
          marginLeft={5}
        >
          <Box width={8} height={8} borderRadius={4} bgcolor={'#219653'} mr={1} />
          <Typography fontSize={12} fontWeight={500} color={'#027A48'}>
            Online
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BottomBar;
