import * as d3 from 'd3';
import _ from 'lodash';

import { TABLE_WIDTH } from '../components/canvas/CanvasTable';
import { Table } from '../redux/slice/schemas';

interface TableCoordinates {
  id: string;
  x: number;
  y: number;
}

// const generateTableLayout = (tables: Table[], edges: any[]): TableCoordinates[] => {
//   const padding = 100;
//   const screenWidth = window.innerWidth * 2;

//   const adjustedTables = tables.map((table) => {
//     // deep clone the table object before adding properties
//     const tableCopy = _.cloneDeep(table);
//     return {
//       ...tableCopy,
//       id: table.name, // use name instead of id
//       width: TABLE_WIDTH,
//       height: table.columns.length * 44,
//       x: Math.random() * screenWidth,
//       y: Math.random() * screenWidth,
//     };
//   });

//   const tableMap = new Map<string, any>(tables.map((table) => [table.name, table]));

//   const adjustedEdges = edges.map((edge) => {
//     const sourceNode = tableMap.get(edge.source);
//     const targetNode = tableMap.get(edge.target);

//     if (!sourceNode || !targetNode) {
//       console.log('Undefined node:', edge);
//     }

//     return {
//       ...edge,
//       source: sourceNode as any,
//       target: targetNode as any,
//     };
//   });

//   // create a d3 force simulation
//   const simulation = d3
//     .forceSimulation(adjustedTables)
//     .force('center', d3.forceCenter(screenWidth / 2, screenWidth / 2))
//     .force('collide', d3.forceCollide((d: any) => d.width / 2 + padding).iterations(16))
//     .force('charge', d3.forceManyBody().strength(-2500))
//     .force('x', d3.forceX().strength(0.2))
//     .force('y', d3.forceY().strength(0.2))
//     // apply forceLink to consider edges
//     // .force(
//     //   'link',
//     //   d3.forceLink(adjustedEdges).id((d: any) => d.id)
//     // )
//     .stop();

//   // run the simulation for a set number of iterations
//   const numIterations = 100;
//   for (let i = 0; i < numIterations; ++i) {
//     simulation.tick();
//   }

//   return adjustedTables.map((table) => {
//     return { id: table.id, x: table.x, y: table.y };
//   });
// };

const generateTableLayout = (tables: Table[], edges: any[]): TableCoordinates[] => {
  const padding = 100;
  const screenWidth = window.innerWidth * 2;

  const adjustedTables = tables.map((table) => {
    // deep clone the table object before adding properties
    const tableCopy = _.cloneDeep(table);

    return {
      ...tableCopy,
      id: tableCopy.name,
      width: TABLE_WIDTH,
      height: tableCopy.columns.length * 44,
      x: Math.random() * screenWidth,
      y: Math.random() * screenWidth,
    };
  });

  // create a d3 force simulation
  const simulation = d3
    .forceSimulation(adjustedTables)
    .force('center', d3.forceCenter(screenWidth / 2, screenWidth / 2))
    .force('collide', d3.forceCollide((d: any) => d.width / 2 + padding).iterations(16))
    .force('charge', d3.forceManyBody().strength(-2500))
    .force('x', d3.forceX().strength(0.2))
    .force('y', d3.forceY().strength(0.2))
    .force(
      'link',
      d3
        .forceLink(edges)
        .id((d: any) => d.id)
        .distance(200)
        .strength(1)
    )
    .stop();

  // run the simulation for a set number of iterations
  const numIterations = 300;
  for (let i = 0; i < numIterations; ++i) {
    simulation.tick();
  }

  return adjustedTables.map((table) => {
    return { id: table.id, x: table.x, y: table.y };
  });
};

export default generateTableLayout;
