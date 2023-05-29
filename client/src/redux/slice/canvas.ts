import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge, Node } from 'reactflow';

interface NodesState {
  nodes: Node[];
  edges: Edge[];
  schemaId: string;
}

const initialState: NodesState[] = [];

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    handleNodeChange: (state, { payload }: PayloadAction<{ node: Node[]; schemaId: string }>) => {
      const currentItem = state.filter((schema) => schema.schemaId === payload.schemaId)[0];

      if (currentItem) {
        const removeCurrentItemFromState = state.filter((s) => s.schemaId !== payload.schemaId);

        return [
          ...removeCurrentItemFromState,
          {
            nodes: payload.node,
            edges: currentItem.edges,
            schemaId: payload.schemaId,
          },
        ];
      }
    },

    handleEdgeChange: (state, { payload }: PayloadAction<{ edge: Edge[]; schemaId: string }>) => {
      const currentItem = state.filter((schema) => schema.schemaId === payload.schemaId)[0];

      if (currentItem) {
        const removeCurrentItemFromState = state.filter((s) => s.schemaId !== payload.schemaId);

        return [
          ...removeCurrentItemFromState,
          {
            nodes: currentItem.nodes,
            edges: payload.edge,
            schemaId: payload.schemaId,
          },
        ];
      }
    },
    setNodeState: (state, { payload }: PayloadAction<{ node: Node[]; edge: Edge[]; schemaId: string }>) => {
      const currentItem = state.filter((schema) => schema.schemaId === payload.schemaId)[0];

      if (currentItem) {
        const removeCurrentItemFromState = state.filter((s) => s.schemaId !== payload.schemaId);

        return [
          ...removeCurrentItemFromState,
          {
            nodes: payload.node,
            edges: payload.edge,
            schemaId: payload.schemaId,
          },
        ];
      } else {
        state.push({
          nodes: payload.node,
          edges: payload.edge,
          schemaId: payload.schemaId,
        });
      }
    },

    removeNode: (state, { payload }: PayloadAction<{ schemaId: string }>) => {
      const activeSchemaIndex = state.findIndex((schema) => schema.schemaId === payload.schemaId);

      if (activeSchemaIndex !== -1) {
        const removeActiveSchemaFromState = state.filter((_, index) => index !== activeSchemaIndex);

        return [...removeActiveSchemaFromState];
      }
    },
  },
});

export const { handleNodeChange, setNodeState, handleEdgeChange } = canvasSlice.actions;

export default canvasSlice.reducer;
