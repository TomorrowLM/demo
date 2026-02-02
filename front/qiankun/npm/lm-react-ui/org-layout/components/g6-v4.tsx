import G6, { Graph as IGraph } from '@antv/g6';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from '../index.less';

const FONT_FAMILY = "'PingFang SC', 'Microsoft YaHei', sans-serif";

type TreeNode = {
  id?: string;
  name?: string | { name: string; tag?: any[]; tip?: string }[] | any;
  children?: TreeNode[];
  symbolSize?: number | [number, number];
  color?: string;
  bg?: string;
  fontSize?: number;
  textColor?: string;
  tip?: string;
  tag?: any[];
  collapsed?: boolean;
  level?: number;
};

const NODE_LINE_WIDTH = 1.2;
// 全局按层 busY 映射，避免在边绘制时依赖 group 获取 graph（更稳定）
let GLOBAL_ORG_BUS_MAP: Record<number, number> = {};
function normalizeName(name: TreeNode['name']) {
  if (Array.isArray(name)) return name as any[];
  return [{ name: typeof name === 'string' ? name : '' }];
}
const registerNodeOnce = (() => {
  let registered = false;
  return () => {
    if (registered) return;
    registered = true;

    G6.registerNode('org-node', {
      draw(cfg = {}, group) {
        const {
          symbolSize = [200, 80],
          color,
          bg,
          textColor,
          name,
        } = cfg as TreeNode;
        const [width, height] = Array.isArray(symbolSize)
          ? symbolSize
          : [Number(symbolSize) || 200, Number(symbolSize) || 80];

        const fill = bg || '#F5FAFF';
        const stroke = color || '#2b2f8f';
        const resolvedTextColor =
          textColor || (fill === '#F5FAFF' ? '#1f2d3d' : '#fff');

        const rect = group.addShape('rect', {
          name: 'rect-shape',
          attrs: {
            x: -width / 2,
            y: -height / 2,
            width,
            height,
            radius: 10,
            fill,
            stroke,
            lineWidth: NODE_LINE_WIDTH,
            shadowColor: 'rgba(0,0,0,0.08)',
            shadowBlur: 12,
            shadowOffsetY: 4,
          },
        });

        const titleYStart = -height / 2 + 20;
        const lineHeight = 20;
        const texts = normalizeName(name);

        let currentY = titleYStart;
        texts.forEach((item, index) => {
          const text = item.name || '';
          const fontSize = item.fontSize || 14;
          const [nameWidth] = G6.Util.getTextSize(
            text,
            fontSize,
            400,
            FONT_FAMILY,
          );
          const nameWeight = index === 0 ? 600 : 400;
          const tagGap = 8;

          if (item.tag && Array.isArray(item.tag) && item.tag.length > 0) {
            const tagMeta = item.tag.map((tagItem: any) => {
              const label = tagItem.name || '';
              const [textWidth] = G6.Util.getTextSize(
                label,
                12,
                400,
                FONT_FAMILY,
              );
              const tagWidth = Math.max(28, textWidth + 16);
              return { label, tagItem, tagWidth };
            });
            const tagsWidth =
              tagMeta.reduce((sum: number, t: any) => sum + t.tagWidth, 0) +
              Math.max(0, tagMeta.length - 1) * tagGap;
            const rowGap = 12;
            const rowWidth = nameWidth + rowGap + tagsWidth;
            let cursorX = -rowWidth / 2;

            // name on the left
            group.addShape('text', {
              name: `text-${index}`,
              attrs: {
                x: cursorX + nameWidth / 2,
                y: currentY,
                text,
                fill: resolvedTextColor,
                fontSize,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                textBaseline: 'top',
                fontWeight: nameWeight,
              },
            });
            cursorX += nameWidth + rowGap;

            // tags on the right of the same row
            tagMeta.forEach(
              ({ label, tagItem, tagWidth }: any, tagIdx: number) => {
                group.addShape('rect', {
                  name: `tag-${index}-${tagIdx}`,
                  attrs: {
                    x: cursorX,
                    y: currentY,
                    width: tagWidth,
                    height: 18,
                    radius: 4,
                    stroke: tagItem.borderColor || stroke,
                    fill: tagItem.background || '#fff',
                    lineWidth: 1,
                  },
                });
                group.addShape('text', {
                  name: `tag-text-${index}-${tagIdx}`,
                  attrs: {
                    x: cursorX + tagWidth / 2,
                    y: currentY + 2,
                    text: label,
                    fill: tagItem.color || stroke,
                    fontSize: 12,
                    fontFamily: FONT_FAMILY,
                    textAlign: 'center',
                    textBaseline: 'top',
                  },
                });
                cursorX += tagWidth + tagGap;
              },
            );

            currentY += lineHeight + 8;
          } else {
            group.addShape('text', {
              name: `text-${index}`,
              attrs: {
                x: 0,
                y: currentY,
                text,
                fill: resolvedTextColor,
                fontSize,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                textBaseline: 'top',
                fontWeight: nameWeight,
              },
            });
            currentY += lineHeight;
          }

          if (item.tip) {
            group.addShape('text', {
              name: `tip-${index}`,
              attrs: {
                x: 0,
                y: currentY,
                text: item.tip,
                fill: '#6c757d',
                fontSize: 12,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                textBaseline: 'top',
              },
            });
            currentY += 16;
          }
        });

        if (cfg.children && (cfg.children as TreeNode[]).length > 0) {
          group.addShape('circle', {
            name: 'child-indicator',
            attrs: {
              x: width / 2 - 12,
              y: height / 2 - 12,
              r: 8,
              stroke,
              fill: '#fff',
              lineWidth: 1,
            },
          });
          group.addShape('text', {
            name: 'child-indicator-text',
            attrs: {
              x: width / 2 - 12,
              y: height / 2 - 15,
              text: cfg.collapsed ? '+' : '-',
              fill: stroke,
              fontSize: 14,
              textAlign: 'center',
              textBaseline: 'top',
            },
          });
        }

        return rect;
      },
    });

    // 官方折线树图示例的折线路径：垂直-水平-垂直
    G6.registerEdge('org-edge', {
      draw(cfg, group) {
        const { startPoint, endPoint, style = {}, source } = cfg as any;
        // 使用 busOffset（默认 48）从父节点底部向下作为公共水平线高度
        const busOffset =
          typeof style.busOffset === 'number' ? style.busOffset : 48;

        // 默认 busY 为 startPoint.y + busOffset
        let busY = startPoint.y + busOffset;
        try {
          // 优先使用全局 map（由布局完成时计算并写入）
          if (GLOBAL_ORG_BUS_MAP && typeof source !== 'undefined') {
            const graph = (group as any).get('graph');
            const sourceItem = source ? graph.findById(source) : null;
            const sourceLevel = sourceItem
              ? (sourceItem.getModel() as TreeNode).level
              : undefined;
            if (
              typeof sourceLevel !== 'undefined' &&
              GLOBAL_ORG_BUS_MAP[sourceLevel] !== undefined
            ) {
              busY = GLOBAL_ORG_BUS_MAP[sourceLevel];
            } else if (sourceItem) {
              const bbox = sourceItem.getBBox();
              busY = bbox.minY + bbox.height + busOffset;
            }
          }
        } catch (e) {
          // 保持 busY 为 startPoint.y + busOffset
        }

        const path = [
          ['M', startPoint.x, startPoint.y],
          ['L', startPoint.x, busY],
          ['L', endPoint.x, busY],
          ['L', endPoint.x, endPoint.y],
        ];

        return group.addShape('path', {
          attrs: {
            path,
            stroke: style.stroke || '#dfe6e9',
            lineWidth: style.lineWidth || 1,
            endArrow: style.endArrow || {
              path: 'M 0,0 L 10,-5 L 10,5 Z',
              fill: style.stroke || '#dfe6e9',
            },
            lineCap: 'round',
          },
          name: 'org-edge-path',
        });
      },
    });
  };
})();

function calculateNodeSize(data: TreeNode) {
  const defaultWidth = Array.isArray(data.symbolSize)
    ? data.symbolSize[0]
    : typeof data.symbolSize === 'number'
    ? data.symbolSize
    : 220;

  const baseHeight = Array.isArray(data.symbolSize)
    ? data.symbolSize[1]
    : typeof data.symbolSize === 'number'
    ? data.symbolSize
    : 60;

  const nameArray = normalizeName(data.name);
  let lines = 0;
  nameArray.forEach((item) => {
    const text = item.name || '';
    const display = text.length > 20 ? `${text.substring(0, 18)}...` : text;
    const lineCount = Math.max(1, Math.ceil(display.length / 12));
    lines += lineCount;
    if (item.tip) lines += 0.6;
    if (item.tag && item.tag.length > 0) lines += 1;
  });

  const lineHeight = 20;
  const padding = 35;
  const computedHeight = padding + lines * lineHeight;
  return [defaultWidth, Math.max(baseHeight, computedHeight)] as [
    number,
    number,
  ];
}

function enrichTree(data: TreeNode, level = 0): TreeNode {
  const id = data.id || `node-${Math.random().toString(36).slice(2, 10)}`;
  const size = calculateNodeSize(data);
  const children = (data.children || []).map((child) =>
    enrichTree(child, level + 1),
  );
  return {
    ...data,
    id,
    level,
    symbolSize: size,
    children,
  };
}
// function extractName(name: TreeNode['name']) {
// 	if (Array.isArray(name)) return (name as any[]).map((i) => i.name).join(' ')
// 	if (typeof name === 'string') return name
// 	return ''
// }

function extractTip(name: TreeNode['name']) {
  if (Array.isArray(name)) {
    const first = (name as any[]).find((i) => i.tip);
    return first ? first.tip : '';
  }
  return '';
}
const G6Org: React.FC<{ data: TreeNode }> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<IGraph | null>(null);
  // const [searchValue, setSearchValue] = useState('')
  // const [stats, setStats] = useState({ nodes: 0, edges: 0, levels: 0 })

  const chartData = useMemo(() => enrichTree(data), [data]);
  const updateStats = (graph: IGraph) => {
    const nodes = graph.getNodes();
    // const edges = graph.getEdges()
    let maxLevel = 0;
    nodes.forEach((node) => {
      const model = node.getModel() as TreeNode;
      maxLevel = Math.max(maxLevel, model.level || 0);
    });
    // setStats({ nodes: nodes.length, edges: edges.length, levels: maxLevel + 1 })
  };

  const bindTooltip = (
    graph: IGraph,
    tooltipDom: React.RefObject<HTMLDivElement>,
  ) => {
    if (!tooltipDom.current) return;

    const tooltip = tooltipDom.current;
    graph.on('node:mouseenter', (evt) => {
      const { item, canvasX, canvasY } = evt;
      if (!item) return;
      graph.setItemState(item, 'hover', true);
      const model = item.getModel() as TreeNode;
      const tip = model.tip || extractTip(model.name);
      if (!tip) return;
      tooltip.style.display = 'block';
      tooltip.style.left = `${canvasX + 12}px`;
      tooltip.style.top = `${canvasY + 12}px`;
      tooltip.innerText = tip;
    });

    graph.on('node:mousemove', (evt) => {
      const { canvasX, canvasY } = evt;
      tooltip.style.left = `${canvasX + 12}px`;
      tooltip.style.top = `${canvasY + 12}px`;
    });

    graph.on('node:mouseleave', (evt) => {
      const { item } = evt;
      if (item) graph.setItemState(item, 'hover', false);
      tooltip.style.display = 'none';
    });

    graph.on('canvas:click', () => {
      tooltip.style.display = 'none';
    });
  };

  const bindCollapse = (graph: IGraph, onLayoutChange: (g: IGraph) => void) => {
    graph.on('node:click', (evt) => {
      const { item } = evt;
      if (!item) return;
      const model = item.getModel() as TreeNode;
      if (model.children && model.children.length) {
        model.collapsed = !model.collapsed;
        // graph.refreshLayout()
        graph.setItemState(item, 'collapsed', model.collapsed);
        onLayoutChange(graph);
      }
    });
  };
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (graphRef.current) {
      graphRef.current.destroy();
      graphRef.current = null;
    }

    registerNodeOnce();

    const graph = new G6.TreeGraph({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
      fitCenter: true,
      linkCenter: true,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
      },
      defaultNode: {
        type: 'org-node',
        size: [200, 80],
      },
      defaultEdge: {
        type: 'org-edge',
        style: {
          stroke: '#dfe6e9',
          lineWidth: 1,
          busOffset: 80,
        },
      },
      nodeStateStyles: {
        hover: {
          shadowColor: 'rgba(52,152,219,0.35)',
          shadowBlur: 16,
        },
        highlight: {
          lineWidth: NODE_LINE_WIDTH + 1,
          stroke: '#f39c12',
        },
      },
      layout: {
        type: 'compactBox',
        direction: 'TB',
        getId: (d: any) => d.id,
        getHeight: (d: any) =>
          Array.isArray(d.symbolSize) ? d.symbolSize[1] : 60,
        getWidth: (d: any) =>
          Array.isArray(d.symbolSize) ? d.symbolSize[0] : 200,
        getVGap: () => 30,
        getHGap: () => 40,
      },
      animate: true,
      animateCfg: {
        duration: 400,
      },
    });

    graphRef.current = graph;
    graph.data(chartData);
    graph.render();

    // 在布局完成后为每个节点计算统一的 busY（基于节点 bbox 与 busOffset），
    // 存入 graph 的 orgBusYMap，供自定义边绘制时使用，确保同一父节点的子节点共享同一水平干线。
    const computeBusMap = () => {
      try {
        // const levelMap: Record<number, number[]> = {};
        const nodes = graph.getNodes();
        const defaultEdgeStyle =
          (graph.get('defaultEdge') &&
            (graph.get('defaultEdge') as any).style) ||
          {};
        // const busOffset = typeof defaultEdgeStyle.busOffset === 'number' ? defaultEdgeStyle.busOffset : 48;

        // 收集有 children 的节点（父节点），按 level 分组，计算每组的 bbox.bottom 和 height
        const bottomMap: Record<number, number[]> = {};
        const heightMap: Record<number, number[]> = {};
        nodes.forEach((node: any) => {
          const model = node.getModel() as TreeNode;
          if (model && model.children && model.children.length) {
            const level = model.level || 0;
            const bbox = node.getBBox();
            const bottom = bbox.minY + bbox.height;
            const height = bbox.height;
            if (!bottomMap[level]) bottomMap[level] = [];
            if (!heightMap[level]) heightMap[level] = [];
            bottomMap[level].push(bottom);
            heightMap[level].push(height);
          }
        });

        // 对每个 level 取 max bottom，并结合该层最大父节点高度计算动态偏移
        const busMapByLevel: Record<number, number> = {};
        const minOffset =
          typeof defaultEdgeStyle.busOffset === 'number'
            ? defaultEdgeStyle.busOffset
            : 48;
        const ratio = 0.3; // 可以调整为 0.25~0.4 以控制分叉高度相对节点高度的比例
        Object.keys(bottomMap).forEach((lvl) => {
          const level = Number(lvl);
          const maxBottom = Math.max(...bottomMap[level]);
          const maxHeight = Math.max(...(heightMap[level] || [0]));
          const dynamicOffset = Math.max(
            minOffset,
            Math.round(maxHeight * ratio),
          );
          busMapByLevel[level] = maxBottom + dynamicOffset;
        });

        graph.set('orgBusYMap', busMapByLevel);
        // 同步到全局变量，供边绘制直接读取
        GLOBAL_ORG_BUS_MAP = busMapByLevel;
        // 同步到全局变量，供边绘制直接读取
        GLOBAL_ORG_BUS_MAP = busMapByLevel;
      } catch (e) {
        // ignore
      }
    };

    graph.on('afterlayout', () => {
      computeBusMap();
      graph.refresh();
      graph.fitView(20);
    });

    // 触发一次计算（如果已经完成布局）
    computeBusMap();
    graph.fitView(20);
    updateStats(graph);
    bindTooltip(graph, tooltipRef);

    // 作用是在布局完成后再调整视图和更新统计数据
    const refreshLayout = (g: IGraph) => {
      g.layout();
      g.fitView(20);
      updateStats(g);
    };

    bindCollapse(graph, refreshLayout);

    const handleResize = () => {
      if (!graphRef.current || !containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      graphRef.current.changeSize(clientWidth, clientHeight);
      graphRef.current.fitView(20);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      graphRef.current?.destroy();
      graphRef.current = null;
    };
  }, [chartData]);

  // const clearHighlight = () => {
  // 	const graph = graphRef.current
  // 	if (!graph) return
  // 	graph.getNodes().forEach((node) => graph.clearItemStates(node))
  // }

  // const handleSearch = () => {
  // 	const graph = graphRef.current
  // 	if (!graph) return
  // 	const keyword = searchValue.trim().toLowerCase()
  // 	clearHighlight()
  // 	if (!keyword) return

  // 	const matched = graph.getNodes().filter((node) => {
  // 		const model = node.getModel() as TreeNode
  // 		const text = extractName(model.name)
  // 		return text.toLowerCase().includes(keyword)
  // 	})

  // 	matched.forEach((node) => {
  // 		graph.setItemState(node, 'highlight', true)
  // 	})

  // 	if (matched.length) {
  // 		graph.focusItem(matched[0], true, {
  // 			easing: 'easeCubic',
  // 			duration: 400,
  // 		})
  // 	}
  // }

  // const handleZoom = (ratio: number) => {
  // 	const graph = graphRef.current
  // 	const container = containerRef.current
  // 	if (!graph || !container) return
  // 	const center = { x: container.clientWidth / 2, y: container.clientHeight / 2 }
  // 	graph.zoom(ratio, center)
  // }

  // const handleFitView = () => {
  // 	graphRef.current?.fitView(20)
  // }

  // const handleExport = () => {
  // 	graphRef.current?.downloadImage('org-chart.png')
  // }

  // const toggleAll = (collapsed: boolean) => {
  // 	const graph = graphRef.current
  // 	if (!graph) return
  // 	const data = graph.get('data') as TreeNode
  // 	const mutate = (node: TreeNode) => {
  // 		node.collapsed = collapsed
  // 			; (node.children || []).forEach(mutate)
  // 	}
  // 	mutate(data)
  // 	graph.refreshLayout()
  // 	updateStats(graph)
  // }

  // const handleReset = () => {
  // 	const graph = graphRef.current
  // 	if (!graph) return
  // 	graph.getNodes().forEach((node) => graph.clearItemStates(node))
  // 	graph.setZoom(1)
  // 	graph.focusItem(graph.getNodes()[0], true)
  // 	graph.fitView(20)
  // }

  return (
    <div className={styles.container}>
      {/* <div className="toolbar">
        <div className="searchBox">
          <input
            type="text"
            className="searchInput"
            placeholder="搜索部门或人员..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn" onClick={handleSearch}>
            搜索
          </button>
        </div>
        <div className="stats">
          <div className="statItem">
            <span>节点:</span>
            <span>{stats.nodes}</span>
          </div>
          <div className="statItem">
            <span>连接:</span>
            <span>{stats.edges}</span>
          </div>
          <div className="statItem">
            <span>层级:</span>
            <span>{stats.levels}</span>
          </div>
        </div>
      </div> */}

      <div className={styles.chartContainer} ref={containerRef} />
      {/* 
      <div className="controls">
        <button className="btn" onClick={() => handleZoom(1.1)}>放大</button>
        <button className="btn" onClick={() => handleZoom(0.9)}>缩小</button>
        <button className="btn" onClick={handleFitView}>适应屏幕</button>
        <button className="btn btn-export" onClick={handleExport}>导出图片</button>
        <button className="btn btn-expand" onClick={() => toggleAll(false)}>展开全部</button>
        <button className="btn" onClick={() => toggleAll(true)}>折叠全部</button>
        <button className="btn btn-reset" onClick={handleReset}>重置视图</button>
      </div> */}

      {/* <div className="legend">
        <div className="legendItem">
          <div className="legendColor" style={{ background: '#3949f7' }} />
          <span>公司总部</span>
        </div>
        <div className="legendItem">
          <div className="legendColor" style={{ background: '#2b2f8f' }} />
          <span>一级部门</span>
        </div>
        <div className="legendItem">
          <div className="legendColor" style={{ background: '#1a1d5a' }} />
          <span>二级部门</span>
        </div>
        <div className="legendItem">
          <div className="legendColor" style={{ background: '#FC6221' }} />
          <span>特殊标签</span>
        </div>
      </div> */}

      {/* <div className="footer">
        <p>© 2024 公司组织架构图 | 使用 AntV G6 构建 | 数据实时更新</p>
      </div> */}

      {/* <div className="tooltip" ref={tooltipRef} /> */}
    </div>
  );
};

export default G6Org;
