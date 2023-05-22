import 'reactflow/dist/style.css';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ReactFlow, { MiniMap, Controls, addEdge, applyNodeChanges, applyEdgeChanges, Background } from 'reactflow';
import { useParams } from 'react-router-dom';

import NewSchemaHeader from '../../components/NewSchemaHeader';
import CanvasDrawer from '../../components/canvas/CanvasDrawer';
import SchemaProperties from '../../components/canvas/SchemaProperties';
// import Table from '../../components/canvas/Table';
import CanvasTable from '../../components/canvas/CanvasTable';
import { useAppSelector } from '../../redux/hooks';
import generateForeignKeyName from '../../utils/generateFkName';
import generateTableLayout from '../../utils/generateTableLayout';

const EditSchema = () => {
  const params = useParams();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === params.id))[0];

  const nodeTypes = useMemo(() => ({ table: CanvasTable }), []);

  const tableLayout = generateTableLayout(schema.tables || []);

  console.log(tableLayout);

  const containerRef = useRef<any>(null);
  const initialNodes: any = schema?.tables?.map((table, index) => {
    return {
      id: table.name,
      type: 'table',
      position: tableLayout[table.id],
      data: {
        title: table.name,
        columns: table.columns.map((c) => {
          return {
            name: c.name,
            type: c.type,
            primaryKey: c.primaryKey,
            foreignKey: table.foreignKeys.filter((fk) => fk.column === c.name).length > 0,
            notNull: c.nullable,
            comment: '',
            unique: c.unique,
            default: '',
          };
        }),
      },
    };
  });

  const tablesWithForeignKeys = schema?.tables?.filter((table) => table.foreignKeys.length > 0);

  const initialEdges: any =
    schema &&
    schema.tables &&
    schema.tables.length > 0 &&
    tablesWithForeignKeys?.map((table, index) => {
      return {
        id: table.name + 'to' + table.foreignKeys[index].referenceTable,
        source: table.name,
        target: table.foreignKeys[index].referenceTable,
        animated: false,
        type: 'step',
        label: generateForeignKeyName(table, index),
      };
    });

  console.log(initialEdges);

  const [drawerState, setDrawerState] = useState<boolean>(false);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), []);

  return (
    <Box ref={containerRef} style={{ width: '100%', height: window.innerHeight - 180, position: 'relative' }}>
      <NewSchemaHeader toggleSettingsDrawer={setDrawerState} drawerState={drawerState} />

      <CanvasDrawer toggleOpen={setDrawerState} open={drawerState}>
        <SchemaProperties toggleOpen={setDrawerState} />
      </CanvasDrawer>

      <Box style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          style={{ width: '100%', height: '100%' }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default EditSchema;
