import 'reactflow/dist/style.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useParams } from 'react-router-dom';
import ReactFlow, { MiniMap, Controls, useNodesState, useEdgesState, addEdge } from 'reactflow';

import NewSchemaHeader from '../../components/NewSchemaHeader';
import CanvasDrawer from '../../components/CanvasDrawer';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const NewSchema = () => {
  const containerRef = useRef<any>(null);
  const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ];

  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

  const theme = useTheme();
  const colors = tokens();

  const [drawerState, setDrawerState] = useState<boolean>(true);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <Box ref={containerRef} style={{ width: '100%', height: '85%', position: 'relative' }}>
      <NewSchemaHeader toggleSettingsDrawer={setDrawerState} />

      <CanvasDrawer open={drawerState} toggleDrawer={setDrawerState}>
        <Box width={300}>
          <p>Hello</p>
        </Box>
      </CanvasDrawer>

      <Box style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          style={{ width: '100%', height: '100%' }}
        >
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default NewSchema;
