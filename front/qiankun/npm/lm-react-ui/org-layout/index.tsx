// import { getDeptTreeAndPersons, getRoleEnums } from '@/services/ai-org';
// import { useRequest } from 'ahooks';
// import { Spin, message } from 'antd';
// import React, { useEffect, useMemo } from 'react';
// import { useModel, useSearchParams } from 'umi';
// import G6Org from './components/g6-v5';
// import styles from './index.less';
// import { dataToTreeData } from './transform';
// const OrgLayoutPage: React.FC = () => {
//   const { userInfo } = useModel('userInfoModel');
//   const [searchParams] = useSearchParams();
//   const qyzzId = searchParams.get('qyzzId') || null;
//   const fetchDeptTree = () => {
//     console.trace('fetchDeptTree triggered', qyzzId);
//     return getDeptTreeAndPersons({ qyzzId });
//   };
//   const {
//     data: deptTree,
//     loading: deptLoading,
//     error: deptError,
//     run: runDeptTree,
//   } = useRequest(fetchDeptTree, { manual: true });
//   const fetchRoleEnums = () => {
//     console.trace('fetchRoleEnums triggered');
//     return getRoleEnums({ qycslx: userInfo?.user.QYCSLX || '' });
//   };
//   const {
//     data: roleMap,
//     loading: roleLoading,
//     run: runRoleEnums,
//   } = useRequest(fetchRoleEnums, { manual: true });

//   const hasRequested = React.useRef(false);

//   const chartData = useMemo(() => {
//     console.log('deptTree, roleMap', deptTree, roleMap, userInfo?.user.QYCSLX);
//     if (!deptTree || !(roleMap && roleMap.data)) return;
//     console.log('transforming data...');
//     const data = dataToTreeData(deptTree, roleMap.data);

//     if (Array.isArray(data.name)) {
//       data.name = (data.name as any[]).filter(
//         (child: any, index: number) => index === 0 || child.rylxDm === '1',
//       );
//     }
//     console.log('transformed data:', data);
//     return data;
//   }, [deptTree, roleMap]);
//   const downloadCanvas = async (opts?: {
//     scale?: number;
//     fileName?: string;
//     asSvg?: boolean; // 是否导出为 SVG 格式，而非 PNG
//   }) => {
//     const scale = opts?.scale ?? 2;
//     const asSvg = Boolean(opts?.asSvg);
//     const defaultName = asSvg
//       ? `${userInfo?.user?.NSRMC || 'org-chart'}`
//       : `${userInfo?.user?.NSRMC || 'org-chart'}`;
//     const fileName = opts?.fileName ?? defaultName;

//     const loading = message.loading('正在导出图片，请稍候...', 0);
//     try {
//       // 1) Try to find G6 graph instance attached to some container DOM
//       let graph: any = null;
//       const all = Array.from(document.querySelectorAll('*')) as HTMLElement[];
//       for (const el of all) {
//         if ((el as any).__g6_graph) {
//           graph = (el as any).__g6_graph;
//           break;
//         }
//       }

//       const pixelRatio =
//         Math.max(2, window.devicePixelRatio || 1) * (scale || 1);
//       if (!asSvg && graph && typeof graph.downloadImage === 'function') {
//         try {
//           // Some G6 versions accept options as third arg
//           console.log(
//             'using graph.downloadImage with pixelRatio',
//             pixelRatio,
//             fileName,
//           );
//           graph.downloadImage(fileName, undefined, { pixelRatio });
//           loading();
//           message.success('图片导出已触发');
//           return;
//         } catch (e) {
//           // fallback
//           // eslint-disable-next-line no-console
//           console.warn('graph.downloadImage failed', e);
//         }
//       }
//       // If graph has a custom downloadSvg helper, use it (it will try SVG->PNG)
//       if (graph && typeof (graph as any).downloadSvg === 'function') {
//         try {
//           const baseName = asSvg
//             ? fileName.replace(/\.svg$/i, '') || 'org-chart'
//             : fileName.replace(/\.png$/i, '') || 'org-chart';
//           await (graph as any).downloadSvg({
//             fileName: baseName,
//             asSvg,
//             scale: Math.max(2, window.devicePixelRatio || 1) * (scale || 1),
//           });
//           loading();
//           message.success('图片导出已触发');
//           return;
//         } catch (e) {
//           // eslint-disable-next-line no-console
//           console.warn('graph.downloadSvg failed', e);
//         }
//       }

//       // Delegate SVG/PNG export to G6 `downloadSvg` (implemented in components/g6.tsx).
//       // If we reached here it means graph either didn't exist or its helpers failed.
//       message.error(
//         '未能通过 G6 导出图片：找不到图表实例或导出失败，请在图表内使用导出功能或刷新页面。',
//       );
//       loading();
//     } catch (err) {
//       // eslint-disable-next-line no-console
//       console.error(err);
//       message.error('导出失败');
//       try {
//         loading();
//       } catch (e) {}
//     }
//   };
//   const getPostMessage = () => {
//     window.addEventListener('message', (event) => {
//       console.log(
//         'received message:',
//         event.data,
//         event.data.action === 'reload',
//       );
//       if (event.data.action === 'reload') {
//         runDeptTree();
//         runRoleEnums();
//       }
//       if (event.data.action === 'download') {
//         downloadCanvas();
//       }
//     });
//   };
//   useEffect(() => {
//     if (hasRequested.current) return;
//     hasRequested.current = true;
//     runDeptTree();
//     runRoleEnums();
//     getPostMessage();
//   }, [runDeptTree, runRoleEnums]);

//   if (deptLoading || roleLoading) {
//     return (
//       <div
//         style={{
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Spin size="large" />
//       </div>
//     );
//   }
//   if (deptError || !chartData) {
//     return (
//       <div
//         style={{
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           color: '#ff4d4f',
//           flexDirection: 'column',
//         }}
//       >
//         <div>组织架构数据加载失败，请稍后重试。</div>
//       </div>
//     );
//   }
//   return (
//     <div className={styles['org-container']}>
//       {/* <div className={styles.header}>
//         <h2 style={{ display: 'inline-block', marginRight: 16 }}>
//           {userInfo?.user?.NSRMC}组织架构图
//         </h2>
//       </div> */}
//       <G6Org data={chartData} />
//     </div>
//   );
// };

// export default OrgLayoutPage;

export default function OrgLayoutPage() {
  return <div>OrgLayoutPage</div>;
}