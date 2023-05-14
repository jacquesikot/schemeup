import 'reactflow/dist/style.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useParams } from 'react-router-dom';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from 'reactflow';

import NewSchemaHeader from '../../components/NewSchemaHeader';

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

  const { name } = useParams<{ name: string }>();

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  useEffect(() => {
    const getSize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      setContainerSize({ width: containerWidth, height: containerHeight });
    };

    getSize();

    window.addEventListener('resize', getSize);
    return () => {
      window.removeEventListener('resize', getSize);
    };
  }, [containerRef]);

  return (
    <Box ref={containerRef}>
      <NewSchemaHeader />

      <Box style={{ width: '1200px', height: '800px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default NewSchema;
