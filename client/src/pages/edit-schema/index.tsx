/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ReactFlow, { MiniMap, Controls, addEdge, applyNodeChanges, applyEdgeChanges, Background, Node } from 'reactflow';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import NewSchemaHeader from '../../components/NewSchemaHeader';
import CanvasDrawer from '../../components/canvas/CanvasDrawer';
import SchemaProperties from '../../components/canvas/SchemaProperties';
import CanvasTable from '../../components/canvas/CanvasTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import generateTableLayout from '../../utils/generateTableLayout';
import { Role, Schema, Table as TableProps, deleteTable, newTable, setActiveTable } from '../../redux/slice/schemas';
import { handleNodeChange, handleEdgeChange, setNodeState } from '../../redux/slice/canvas';
import generateSchemaName from '../../utils/generateSchemaName';
// import getSchemaSuggestions from '../../prompts/getSchemaSuggestions';
import { openRightPanel, toggleRightPanel } from '../../redux/slice/app';
import ImportModal from '../../components/modals/import/ImportSchemaModal';
import ShareSchemaModal from '../../components/modals/share/ShareSchemaModal';
import routes from '../../routes';
import DeleteTableModal from '../../components/modals/DeleteTableModal';
import EmptyState from '../../components/global/EmptyState';
import Button from '../../components/global/Button';
import { removeTab } from '../../redux/slice/apptabs';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.config';

const EditSchema = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const schema = useAppSelector((state) => state.schemas.schemas.filter((s) => s.id === params.id))[0];
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const userRole =
    schema.userId === user?.uid
      ? Role.Admin
      : schema && schema.users
      ? schema.users.filter((u) => u.email === user?.email)[0].role
      : Role.Viewer;

  if (!schema) {
    return (
      <Box style={{ marginTop: '20%' }}>
        <EmptyState
          title={`Schema not found`}
          message={`This schema does not exist, has been moved or deleted.`}
          actionButtons={
            <>
              <Button
                type="primary"
                label="Go back"
                onClick={() => {
                  dispatch(removeTab(tabs.filter((t) => t.route.includes(params.id as string))[0].title));
                  navigate(routes.HOME);
                }}
              />
            </>
          }
        />
      </Box>
    );
  }

  const canvasRaw = useAppSelector((state) => state.canvas).filter((c) => c.schemaId === params.id)[0];
  const drawerOpen = useAppSelector((state) => state.app.rightPanelOpen);
  const canvas = canvasRaw || { nodes: [], edges: [], schemaId: params.id };
  const tableLayout = generateTableLayout(schema.tables || []);
  const tablesWithForeignKeys = schema?.tables?.filter((table) => table.foreignKeys.length > 0);

  const activeTableId = useAppSelector(
    (state) => state.schemas.schemas.filter((s) => s.id === params.id)[0].activeTable
  );

  const nodeTypes = useMemo(() => ({ table: CanvasTable }), []);

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
        const refName = foreignKey.name;
        return {
          id: table.name + 'to' + refTable,
          source: table.name,
          target: refTable,
          animated: false,
          type: 'step',
          label: refName,
        };
      });
    });
  const nodeSchemaTables = schema.tables as any;

  const initialNodes: Node<Schema>[] = nodeSchemaTables.map((table: TableProps) => {
    return {
      id: table.name,
      type: 'table',
      position: {
        x: tableLayout.filter((t) => t.id === table.id)[0].x,
        y: tableLayout.filter((t) => t.id === table.id)[0].y,
      },
      data: {
        id: table.id,
        title: table.name,
        handleUpdate: () => {
          dispatch(setActiveTable({ schemaId: schema.id, tableId: '' }));
          dispatch(openRightPanel());
        },
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
        role={userRole}
        toggleSettingsDrawer={() => dispatch(toggleRightPanel())}
        drawerState={drawerOpen}
        handleNewTable={() => {
          const newTableId = uuidv4();
          dispatch(
            newTable({
              schemaId: schema.id,
              table: {
                id: newTableId,
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
              },
            })
          );
          dispatch(setActiveTable({ schemaId: schema.id, tableId: newTableId }));
          dispatch(openRightPanel());
        }}
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
          onEdgesChange={userRole !== 'viewer' ? onEdgesChange : () => {}}
          onConnect={userRole !== 'viewer' ? onConnect : () => {}}
          onNodeClick={
            userRole !== 'viewer'
              ? (_event, node) => {
                  dispatch(setActiveTable({ schemaId: schema.id, tableId: node.data.id }));
                  dispatch(openRightPanel());
                }
              : () => {}
          }
          onClick={(e) => {
            if (activeTableId) {
              dispatch(setActiveTable({ schemaId: schema.id, tableId: '' }));
            } else {
              e.preventDefault();
            }
          }}
          onNodesDelete={
            userRole !== 'viewer'
              ? (nodes) => {
                  setOpenDeleteModal(true);
                }
              : () => {}
          }
          fitView
          panOnScroll
          // selectionOnDrag
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>

      <ImportModal
        open={showImportModal}
        handleClose={() => setShowImportModal(false)}
        schemaId={schema.id}
        containerStyle={{
          backgroundColor: '#FFFFFF',
          width: 450,
          borderRadius: '12px',
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
        schemaId={schema.id}
        containerStyle={{
          width: '400px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
        }}
      />

      {/* Modal UI - share schema with people */}
      <ShareSchemaModal
        open={showShareModal}
        handleClose={() => {
          toggleShowShareModal(false);
        }}
        schemaId={schema.id}
        containerStyle={{
          width: '450px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
        }}
      />
    </Box>
  );
};

export default EditSchema;
