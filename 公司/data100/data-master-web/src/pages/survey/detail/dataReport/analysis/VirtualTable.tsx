
// import { Table } from 'antd';
// import ProTable from '@ant-design/pro-table';
// import React, { useState, useEffect, useRef } from 'react';
// import { VariableSizeGrid as Grid } from 'react-window';
// import { WindowTable } from 'react-window-table';
// import ResizeObserver from 'rc-resize-observer';
// import classNames from 'classnames';

// const VirtualTable = (props: Parameters<typeof Table>[0]) => {
//   console.log(props)
//   const { columns, scroll } = props;
//   const [tableWidth, setTableWidth] = useState(0);

//   const widthColumnCount = columns!.filter(({ width }) => !width).length;
//   const mergedColumns = columns!.map(column => {
//     if (column.width) {
//       return column;
//     }

//     return {
//       ...column,
//       width: Math.floor(tableWidth / widthColumnCount),
//     };
//   });

//   const gridRef = useRef<any>();
//   const [connectObject] = useState<any>(() => {
//     const obj = {};
//     Object.defineProperty(obj, 'scrollLeft', {
//       get: () => null,
//       set: (scrollLeft: number) => {
//         if (gridRef.current) {
//           gridRef.current.scrollTo({ scrollLeft });
//         }
//       },
//     });

//     return obj;
//   });

//   // const resetVirtualGrid = () => {
//   //   gridRef.current.resetAfterIndices({
//   //     columnIndex: 0,
//   //     shouldForceUpdate: true,
//   //   });
//   // };

//   // useEffect(() => resetVirtualGrid, [tableWidth]);

//   const renderVirtualList = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
//     ref.current = connectObject;
//     const totalHeight = rawData.length * 54;

//     return (
//       <WindowTable.Core
//         height={300}
//         rowCount={100}
//         rowHeight={40}
//         columnCount={100}
//         columnWidth={100}
//         fixedTopCount={1}
//         fixedRightCount={1}
//         fixedBottomCount={1}
//         fixedLeftCount={1}
//       >
//         {(cellData: any) => {
//           console.log(cellData)
//           // <div
//           //   className={classNames('virtual-table-cell', {
//           //     'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
//           //   })}
//           //   style={style}
//           // >
//           //   {(rawData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex]}
//           // </div>
//         }}
//       </WindowTable.Core>
//     );
//   };

//   return (
//     <ResizeObserver
//       onResize={({ width }) => {
//         console.log(width)
//         setTableWidth(width);
//       }}
//     >
//       <ProTable
//         {...props}
//         components={{
//           body: renderVirtualList,
//         }}
//       />
//     </ResizeObserver>
//   );
// }

// export default VirtualTable