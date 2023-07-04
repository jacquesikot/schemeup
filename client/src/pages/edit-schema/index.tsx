/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ReactFlow, { MiniMap, Controls, Background, Node, useNodesState, useEdgesState } from 'reactflow';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import NewSchemaHeader from '../../components/schema/NewSchemaHeader';
import CanvasDrawer from '../../components/canvas/CanvasDrawer';
import SchemaProperties from '../../components/canvas/SchemaProperties';
import CanvasTable from '../../components/canvas/CanvasTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import generateTableLayout from '../../utils/generateTableLayout';
import {
  Role,
  Schema,
  Table as TableProps,
  deleteForeignKey,
  deleteTable,
  newTable,
  setActiveTable,
} from '../../redux/slice/schemas';
import generateSchemaName from '../../utils/generateSchemaName';
import { openRightPanel, toggleRightPanel, triggerSnack } from '../../redux/slice/app';
import ImportModal from '../../components/modals/import/ImportSchemaModal';
import ShareSchemaModal from '../../components/modals/share/ShareSchemaModal';
import routes from '../../routes';
import DeleteTableModal from '../../components/modals/DeleteTableModal';
import EmptyState from '../../components/global/EmptyState';
import Button from '../../components/global/Button';
import { removeTab } from '../../redux/slice/apptabs';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.config';
import DeleteEdgeModal from '../../components/modals/DeleteEdgeModal';
import generateSchemaTablesSql from '../../utils/generateSchemaTablesSql';
import { getSchemaSuggestionsApi } from '../../api/ai';
import { useQuery } from 'react-query';
import queryKeys from '../../utils/keys/query';

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

  // const canvasRaw = useAppSelector((state) => state.canvas).filter((c) => c.schemaId === params.id)[0];
  const drawerOpen = useAppSelector((state) => state.app.rightPanelOpen);
  // const canvas = canvasRaw || { nodes: [], edges: [], schemaId: params.id };
  const tablesWithForeignKeys = schema?.tables?.filter((table) => table.foreignKeys.length > 0);

  const activeTableId = useAppSelector(
    (state) => state.schemas.schemas.filter((s) => s.id === params.id)[0].activeTable
  );

  const nodeTypes = useMemo(() => ({ table: CanvasTable }), []);

  const containerRef = useRef<any>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openDeleteEdgeModal, setOpenDeleteEdgeModal] = useState<boolean>(false);
  const [showShareModal, toggleShowShareModal] = useState<boolean>(false);
  const [showRelations, setShowRelations] = useState<boolean>(true);
  const [aiSuggestions, setAiSuggestions] = useState<any>([]);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [activeEdge, setActiveEdge] = useState<any>(null);

  const initialEdges: any =
    schema &&
    schema.tables &&
    schema.tables.length > 0 &&
    tablesWithForeignKeys?.flatMap((table) => {
      return table.foreignKeys.map((foreignKey, index) => {
        const refTable = foreignKey.referenceTable;
        return {
          id: table.name + 'to' + refTable,
          source: table.name,
          target: refTable,
          animated: false,
          type: 'step',
          label: foreignKey.name,
        };
      });
    });
  const nodeSchemaTables = schema.tables as any;

  const tableLayout = useMemo(() => {
    return generateTableLayout(schema.tables || [], initialEdges || []);
  }, [schema.tables]);

  const initialNodes: Node<Schema>[] = nodeSchemaTables.map((table: TableProps) => {
    return {
      id: table.name,
      type: 'table',
      position: {
        x: tableLayout.filter((t) => t.id === table.name)[0].x,
        y: tableLayout.filter((t) => t.id === table.name)[0].y,
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

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [params.id, schema.tables, openDeleteModal]);

  const { isLoading: fetchSchemaSuggestionsLoading } = useQuery(
    [queryKeys.SCHEMA_SUGGESTIONS, schema.id],
    () => {
      const schemaSql = generateSchemaTablesSql(schema.tables || []);
      return getSchemaSuggestionsApi({ sql: schemaSql, userId: user?.uid as string });
    },
    {
      enabled: !!user?.uid,
      onSuccess: (res: any) => {
        setAiSuggestions(res.suggestions);
        console.log('res', res.suggestions);
      },
      onError: (err: any) => {
        dispatch(
          triggerSnack({
            message: 'Error fetching AI suggestions',
            severity: 'error',
            hideDuration: 3000,
          })
        );
      },
    }
  );

  const showPreview = () => {
    const url = `${routes.SHARE_SCHEMA}/${schema.id}`;
    window.open(url, '_blank', 'noreferrer');
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback((params: any) => {
    dispatch(triggerSnack({ message: 'Feature coming soon!', severity: 'warning', hideDuration: 3000 }));
  }, []);

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
          suggestionLoading={fetchSchemaSuggestionsLoading}
          suggestions={aiSuggestions}
          toggleOpen={() => dispatch(toggleRightPanel())}
          showRelations={showRelations}
          toggleRelations={setShowRelations}
          handleTableDelete={() => setOpenDeleteModal(true)}
        />
      </CanvasDrawer>

      <Box style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={showRelations ? edges : []}
          onNodesChange={onNodesChange}
          onEdgesChange={userRole !== 'viewer' ? onEdgesChange : () => {}}
          onConnect={userRole !== 'viewer' ? onConnect : () => {}}
          onNodeClick={
            userRole !== 'viewer'
              ? (e, node) => {
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
          onEdgesDelete={(edges) => {
            if (userRole !== 'viewer') {
              setActiveEdge(edges[0]);
              setOpenDeleteEdgeModal(true);
            }
          }}
          fitView
          panOnScroll
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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

      <DeleteEdgeModal
        open={openDeleteEdgeModal}
        handleClose={() => {
          setOpenDeleteEdgeModal(false);
        }}
        handleEdgeDelete={() =>
          dispatch(
            deleteForeignKey({
              schemaId: schema.id,
              tableName: activeEdge.source as string,
              foreignKeyName: activeEdge.label as string,
            })
          )
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
