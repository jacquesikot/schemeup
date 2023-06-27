/* eslint-disable react-hooks/exhaustive-deps */
import 'reactflow/dist/style.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ReactFlow, { Background } from 'reactflow';
import { useParams } from 'react-router-dom';

import Table from '../../components/canvas/Table';
import CanvasTable from '../../components/canvas/CanvasTable';
import { useAppSelector } from '../../redux/hooks';
import getSchemaSuggestions from '../../prompts/getSchemaSuggestions';
import generateSchemaTablesSql from '../../utils/generateSchemaTablesSql';
import ShareSchemaHeader from '../../components/schema/ShareSchemaHeader';


const ShareSchema = () => {
  //  const drawerOpen = useAppSelector((state) => state.app.rightPanelOpen);
  const params = useParams();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === params.id))[0];
  const canvasRaw = useAppSelector((state) => state.canvas).filter((c) => c.schemaId === params.id)[0];
  const canvas = canvasRaw || { nodes: [], edges: [], schemaId: params.id };

  const nodeTypes = useMemo(() => ({ table: CanvasTable, editTable: Table }), []);

  const containerRef = useRef<any>(null);

  const [showRelations, setShowRelations] = useState<boolean>(true);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const schemaSql = generateSchemaTablesSql(schema.tables || []);
        const res = await getSchemaSuggestions(schemaSql);
        if (res) {
          const data = res.replace(/^'|'$/g, '');
          if (data) {
            const dataRes = JSON.parse(data);
            if (dataRes) {
              const finalSuggestions = dataRes.suggestions.map((d: any) => {
                return {
                  title: d.severity,
                  body: d.suggestion,
                };
              });
              setAiSuggestions(finalSuggestions);
            }
          }
        }
      } catch (error) {
        // console.log('error in ai', error);
      }
    };

    run();
  }, [schema.tables, schema.description, schema.title]);

  return (
    <Box ref={containerRef} style={{ width: '100%', height: window.innerHeight - 150, position: 'relative' }}>
      <ShareSchemaHeader />

      <Box style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <ReactFlow
          nodes={canvas.nodes}
          nodeTypes={nodeTypes}
          edges={showRelations ? canvas.edges : []}
          fitView
          style={{ width: '100%', height: '100%' }}
        >
          <Background />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default ShareSchema;
