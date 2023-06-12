/* eslint-disable react-hooks/exhaustive-deps */
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ReactFlow, { MiniMap, Controls, addEdge, applyNodeChanges, applyEdgeChanges, Background, Node } from 'reactflow';
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
import {
  Schema,
  Table as TableProps,
  deleteTable,
  editTable,
  newTable,
  setActiveTable,
} from '../../redux/slice/schemas';
import DeleteModal from '../../components/modals/DeleteTableModal';
import { handleNodeChange, handleEdgeChange, setNodeState } from '../../redux/slice/canvas';
import generateSchemaName from '../../utils/generateSchemaName';
import getSchemaSuggestions from '../../prompts/getSchemaSuggestions';
import { toggleRightPanel } from '../../redux/slice/app';
import ImportModal from '../../components/modals/ImportModal';
import ShareSchemaModal from '../../components/modals/share/ShareSchemaModal';
import routes from '../../routes';
import TableV2 from '../../components/canvas/TableV2';
import DeleteTableModal from '../../components/modals/DeleteTableModal';

const EditSchema = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === params.id))[0];
  const canvasRaw = useAppSelector((state) => state.canvas).filter((c) => c.schemaId === params.id)[0];
  const drawerOpen = useAppSelector((state) => state.app.rightPanelOpen);
  const canvas = canvasRaw || { nodes: [], edges: [], schemaId: params.id };
  const tableLayout = generateTableLayout(schema.tables || []);
  const tablesWithForeignKeys = schema?.tables?.filter((table) => table.foreignKeys.length > 0);

  const activeTableId = useAppSelector(
    (state) => state.schemas.schemas.filter((s) => s.id === params.id)[0].activeTable
  );

  const nodeTypes = useMemo(() => ({ table: CanvasTable, editTable: TableV2 }), []);

  const containerRef = useRef<any>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [showShareModal, toggleShowShareModal] = useState<boolean>(false);
  const [showRelations, setShowRelations] = useState<boolean>(true);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  const initialEdges: any =
    schema &&
    schema.tables &&
    schema.tables.length > 0 &&
    tablesWithForeignKeys?.flatMap((table) => {
      return table.foreignKeys.map((foreignKey, index) => {
        const refTable = foreignKey.referenceTable;
        const refColumn = foreignKey.referenceColumn;
        const colName = foreignKey.column;
        return {
          id: table.name + 'to' + refTable,
          source: table.name,
          target: refTable,
          animated: false,
          type: 'step',
          label: generateForeignKeyName(table.name, colName, refTable, refColumn),
        };
      });
    });
  const nodeSchemaTables = schema.tables as any;

  const initialNodes: Node<Schema>[] = nodeSchemaTables.map((table: TableProps) => {
    return {
      id: table.name,
      type: table.meta.type,
      position: {
        x: tableLayout.filter((t) => t.id === table.id)[0].x,
        y: tableLayout.filter((t) => t.id === table.id)[0].y,
      },
      data: {
        id: table.id,
        title: table.name,
        columns: table.columns.map((c) => {
          return {
            name: c.name,
            type: c.type,
            primaryKey: c.primaryKey,
            foreignKey: table.foreignKeys.filter((fk: any) => fk.column === c.name).length > 0,
            nullable: c.nullable,
            index: c.index,
            autoInc: c.autoInc,
            autoUpdateTime: c.autoUpdateTime,
            comment: '',
            unique: c.unique,
            default: '',
          };
        }),
      },
    };
  });

  const onNodesChange = useCallback(
    (changes: any) => {
      const appliedChanges = applyNodeChanges(changes, canvas.nodes);
      dispatch(handleNodeChange({ schemaId: schema.id, node: appliedChanges }));
    },
    [dispatch, canvas.nodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      const appliedChanges = applyEdgeChanges(changes, canvas.edges);
      dispatch(handleEdgeChange({ schemaId: schema.id, edge: appliedChanges }));
      return appliedChanges;
    },
    [dispatch, canvas.edges]
  );

  const onConnect = useCallback(
    (params: any) => {
      const edges = addEdge(params, canvas.edges);
      dispatch(handleEdgeChange({ schemaId: schema.id, edge: edges }));
      return edges;
    },
    [dispatch, canvas.edges]
  );

  useEffect(() => {
    dispatch(setNodeState({ node: initialNodes || [], edge: initialEdges || [], schemaId: schema.id }));
  }, [dispatch, schema.tables, openDeleteModal]);

  // useEffect(() => {
  //   const run = async () => {
  //     try {
  //       const schemaSql = generateSchemaTablesSql(schema.tables || []);
  //       const res = await getSchemaSuggestions(schemaSql);
  //       if (res) {
  //         const data = res.replace(/^'|'$/g, '');
  //         if (data) {
  //           const dataRes = JSON.parse(data);
  //           if (dataRes) {
  //             const finalSuggestions = dataRes.suggestions.map((d: any) => {
  //               return {
  //                 title: d.severity,
  //                 body: d.suggestion,
  //               };
  //             });
  //             setAiSuggestions(finalSuggestions);
  //           }
  //         }
  //       }
  //     } catch (error) {}
  //   };

  //   run();
  // }, [schema.tables, schema.description, schema.title]);

  const showPreview = () => {
    const url = `${routes.SHARE_SCHEMA}/${schema.id}`;
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <Box ref={containerRef} style={{ width: '100%', height: window.innerHeight - 150, position: 'relative' }}>
      <NewSchemaHeader
        toggleSettingsDrawer={() => dispatch(toggleRightPanel())}
        drawerState={drawerOpen}
        handleNewTable={() =>
          dispatch(
            newTable({
              schemaId: schema.id,
              table: {
                id: uuidv4(),
                name: generateSchemaName(),
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
                meta: {
                  type: 'editTable',
                },
              },
            })
          )
        }
        handleShare={() => toggleShowShareModal(true)}
        handleImport={() => setShowImportModal(true)}
        showPreview={showPreview}
      />

      <CanvasDrawer open={drawerOpen}>
        <SchemaProperties
          suggestions={aiSuggestions}
          toggleOpen={() => dispatch(toggleRightPanel())}
          showRelations={showRelations}
          toggleRelations={setShowRelations}
          handleTableDelete={() => setOpenDeleteModal(true)}
        />
      </CanvasDrawer>

      <Box style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <ReactFlow
          nodes={canvas.nodes}
          nodeTypes={nodeTypes}
          edges={showRelations ? canvas.edges : []}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_event, node) => {
            dispatch(setActiveTable({ schemaId: schema.id, tableId: node.data.id }));
          }}
          onClick={(e) => {
            if (activeTableId) {
              dispatch(setActiveTable({ schemaId: schema.id, tableId: '' }));
            } else {
              e.preventDefault();
            }
          }}
          onNodesDelete={(nodes) => {
            setOpenDeleteModal(true);
          }}
          fitView
          panOnScroll
          selectionOnDrag
          // style={{ width: '100%', height: '100%' }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>

      <ImportModal
        open={showImportModal}
        handleClose={() => setShowImportModal(false)}
        containerStyle={{
          backgroundColor: '#FFFFFF',
          width: 480,
          borderRadius: 8,
          padding: '14px',
        }}
      />

      <DeleteTableModal
        open={openDeleteModal}
        handleClose={() => {
          setOpenDeleteModal(false);
        }}
        handleTableDelete={() =>
          dispatch(deleteTable({ schemaId: schema.id, tableId: activeTableId ? activeTableId : '' }))
        }
        itemId={schema.id}
        containerStyle={{
          width: '400px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '20px',
        }}
      />

      {/* Modal UI - share schema with people */}
      <ShareSchemaModal
        open={showShareModal}
        handleClose={() => {
          toggleShowShareModal(false);
        }}
        containerStyle={{
          width: '400px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
        }}
      />
    </Box>
  );
};

export default EditSchema;
