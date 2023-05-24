import 'reactflow/dist/style.css';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ReactFlow, { MiniMap, Controls, addEdge, applyNodeChanges, applyEdgeChanges, Background } from 'reactflow';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import NewSchemaHeader from '../../components/NewSchemaHeader';
import CanvasDrawer from '../../components/canvas/CanvasDrawer';
import SchemaProperties from '../../components/canvas/SchemaProperties';
import Table from '../../components/canvas/Table';
import CanvasTable from '../../components/canvas/CanvasTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import generateForeignKeyName from '../../utils/generateFkName';
import generateTableLayout from '../../utils/generateTableLayout';
import { newTable } from '../../redux/slice/schemas';

const EditSchema = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === params.id))[0];

  const nodeTypes = useMemo(() => ({ table: CanvasTable, editTable: Table }), []);

  const tableLayout = generateTableLayout(schema.tables || []);

  const containerRef = useRef<any>(null);

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

  const [drawerState, setDrawerState] = useState<boolean>(false);

  const [edges, setEdges] = useState(initialEdges);
  const [activeNode, setActiveNode] = useState<any>();

  const initialNodes: any = schema?.tables?.map((table, index) => {
    return {
      id: table.name,
      type: 'table',
      position: {
        x: tableLayout.filter((t) => t.id === table.id)[0].x,
        y: tableLayout.filter((t) => t.id === table.id)[0].y,
      },
      data: {
        title: table.name,
        isActive: activeNode ? activeNode.id === table.id : false,
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

  const [nodes, setNodes] = useState(initialNodes);

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
      <NewSchemaHeader
        toggleSettingsDrawer={setDrawerState}
        drawerState={drawerState}
        handleNewTable={() =>
          dispatch(
            newTable({
              schemaId: schema.id,
              table: {
                id: uuidv4(),
                name: 'new_table',
                columns: [
                  {
                    name: 'id',
                    type: 'int',
                    primaryKey: true,
                    nullable: false,
                    unique: true,
                    default: '',
                    comment: '',
                  },
                ],
                foreignKeys: [],
                indexes: [],
              },
            })
          )
        }
      />

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
          onNodeClick={(event, node) => setActiveNode(node as any)}
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
