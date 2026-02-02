import G6, { Graph as IGraph } from '@antv/g6';
import { Button } from 'antd';
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
let GLOBAL_ORG_BUS_MAP: Record<string, number> = {};
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
          // color,
          bg,
          textColor,
          name,
        } = cfg as TreeNode;
        const [width, height] = Array.isArray(symbolSize)
          ? symbolSize
          : [Number(symbolSize) || 200, Number(symbolSize) || 80];

        const fill = bg || '#F5FAFF';
        const stroke = '#fff0';
        const resolvedTextColor =
          textColor || (fill === '#F5FAFF' ? '#1f2d3d' : '#fff');

        // 作用是： 绘制文本时，文本的宽度不超过矩形的一半
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
                y: currentY + 4,
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
                    y: currentY + 4,
                    text: label,
                    fill: tagItem.color || stroke,
                    fontSize: 10,
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
                fontSize: 10,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                textBaseline: 'top',
              },
            });
            currentY += 16;
          }
        });

        if (cfg.children && (cfg.children as TreeNode[]).length > 0) {
          // collapse indicator removed (no icon shown)
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
          // 优先使用全局 map（由布局完成时计算并写入），按父节点 id 映射。
          if (GLOBAL_ORG_BUS_MAP && typeof source !== 'undefined') {
            const graph = (group as any).get('graph');
            const sourceItem = source ? graph.findById(source) : null;
            const sourceId = sourceItem ? sourceItem.getID() : source;
            if (sourceId && GLOBAL_ORG_BUS_MAP[sourceId] !== undefined) {
              busY = GLOBAL_ORG_BUS_MAP[sourceId];
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
            stroke: style.stroke || '#007aff',
            lineWidth: style.lineWidth || 1,
            endArrow: style.endArrow || {
              path: 'M 0,0 L 10,-5 L 10,5 Z',
              fill: style.stroke || '#007aff',
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

  // const bindCollapse = (graph: IGraph, onLayoutChange: (g: IGraph) => void) => {
  // graph.on('node:click', (evt) => {
  //   const { item } = evt;
  //   if (!item) return;
  //   const model = item.getModel() as TreeNode;
  //   if (model.children && model.children.length) {
  //     model.collapsed = !model.collapsed;
  //     // graph.refreshLayout()
  //     graph.setItemState(item, 'collapsed', model.collapsed);
  //     onLayoutChange(graph);
  //   }
  // });
  // };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (graphRef.current) {
      graphRef.current.destroy();
      graphRef.current = null;
    }

    registerNodeOnce();

    const graph = new G6.TreeGraph({
      // renderer: 'svg',
      container,
      width: container.clientWidth,
      height: container.clientHeight,
      fitCenter: true,
      linkCenter: true,
      modes: {
        // 禁用节点拖动，仅允许画布拖动与缩放
        default: ['drag-canvas', 'zoom-canvas'],
      },
      defaultNode: {
        // 明确禁止节点可拖拽，以防某些 G6 版本仍允许
        draggable: false,
        type: 'org-node',
        size: [200, 80],
      },
      defaultEdge: {
        type: 'org-edge',
        style: {
          stroke: '#007aff',
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
    // expose graph and a helper to download svg/png from this container
    try {
      const containerEl = containerRef.current as any;
      if (containerEl) {
        (containerEl as any).__g6_graph = graph;
      }
    } catch (e) {
      // ignore
    }

    (graph as any).downloadSvg = async (opts?: {
      fileName?: string;
      asSvg?: boolean;
      scale?: number;
    }) => {
      const fileName = (opts && opts.fileName) || 'org-chart';
      const asSvg = Boolean(opts && opts.asSvg);
      const scale =
        (opts && opts.scale) || Math.max(2, window.devicePixelRatio || 1);

      const containerEl = containerRef.current as HTMLElement | null;
      if (!containerEl) return;

      // find candidate svgs inside container and pick the largest visible one
      const svgs = Array.from(
        containerEl.querySelectorAll('svg'),
      ) as SVGSVGElement[];
      const candidateSvgs = svgs.filter((s) => {
        try {
          const r = s.getBoundingClientRect();
          if (r.width < 50 || r.height < 50) return false;
          return r.width * r.height >= 2000;
        } catch (e) {
          return false;
        }
      });
      let svgEl: SVGSVGElement | null = null;
      if (candidateSvgs.length) {
        candidateSvgs.sort((a, b) => {
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          return rb.width * rb.height - ra.width * ra.height;
        });
        svgEl = candidateSvgs[0];
      }

      const downloadBlob = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      };

      if (svgEl) {
        try {
          const serializer = new XMLSerializer();
          let source = serializer.serializeToString(svgEl as Node);
          if (
            !source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
          ) {
            source = source.replace(
              /^<svg/,
              '<svg xmlns="http://www.w3.org/2000/svg"',
            );
          }
          if (
            !source.match(
              /^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/,
            )
          ) {
            source = source.replace(
              /^<svg/,
              '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
            );
          }

          if (asSvg) {
            // ensure exported svg has white background
            try {
              const doc = new DOMParser().parseFromString(
                source,
                'image/svg+xml',
              );
              const svgNode = doc.getElementsByTagName('svg')[0];
              if (svgNode) {
                // try to determine width/height from attributes or viewBox
                let width = svgNode.getAttribute('width');
                let height = svgNode.getAttribute('height');
                if ((!width || !height) && svgNode.getAttribute('viewBox')) {
                  const parts = svgNode.getAttribute('viewBox')!.split(/\s+/);
                  if (parts.length >= 4) {
                    width = width || parts[2];
                    height = height || parts[3];
                  }
                }
                const rect = doc.createElementNS(
                  'http://www.w3.org/2000/svg',
                  'rect',
                );
                rect.setAttribute('x', '0');
                rect.setAttribute('y', '0');
                if (width) rect.setAttribute('width', width);
                if (height) rect.setAttribute('height', height);
                rect.setAttribute('fill', '#ffffff');
                // insert rect as first child so it sits behind other elements
                svgNode.insertBefore(rect, svgNode.firstChild);
                source = new XMLSerializer().serializeToString(doc);
              }
            } catch (e) {
              // ignore parsing errors, fall back to original source
            }
            const blob = new Blob([source], {
              type: 'image/svg+xml;charset=utf-8',
            });
            downloadBlob(blob, `${fileName}.svg`);
            return;
          }

          // convert svg -> png via Image + canvas at desired scale
          const blob = new Blob([source], {
            type: 'image/svg+xml;charset=utf-8',
          });
          const url = URL.createObjectURL(blob);
          await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              try {
                const w = img.width;
                const h = img.height;
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(w * scale));
                canvas.height = Math.max(1, Math.round(h * scale));
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('no canvas context'));
                ctx.setTransform(scale, 0, 0, scale, 0, 0);
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((b) => {
                  if (!b) return reject(new Error('toBlob failed'));
                  downloadBlob(b, `${fileName}.png`);
                  resolve();
                }, 'image/png');
              } catch (e) {
                reject(e);
              } finally {
                URL.revokeObjectURL(url);
              }
            };
            img.onerror = (err) => {
              URL.revokeObjectURL(url);
              reject(err);
            };
            img.src = url;
          });
          return;
        } catch (e) {
          // fallthrough to canvas fallback
        }
      }

      // fallback: find largest canvas inside container
      const canvases = Array.from(
        containerEl.querySelectorAll('canvas'),
      ) as HTMLCanvasElement[];
      if (canvases.length) {
        canvases.sort((a, b) => b.width * b.height - a.width * a.height);
        const c = canvases[0];
        if (c.toBlob) {
          c.toBlob((b) => {
            if (!b) return;
            downloadBlob(b, `${fileName}.png`);
          }, 'image/png');
          return;
        }
        const data = c.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = data;
        a.download = `${fileName}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
    };

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

        // 为每个有子节点的父节点单独计算 busY（父节点 id -> busY），
        // 以确保同一父节点的子节点共享相同水平干线并使分叉长度一致。
        const busMapByParentId: Record<string, number> = {};
        const minOffset =
          typeof defaultEdgeStyle.busOffset === 'number'
            ? defaultEdgeStyle.busOffset
            : 48;
        const ratio = 0.3; // 调整为 0.25~0.4 控制分叉高度相对节点高度的比例

        nodes.forEach((node: any) => {
          const model = node.getModel() as TreeNode;
          if (model && model.children && model.children.length) {
            const bbox = node.getBBox();
            const bottom = bbox.minY + bbox.height;
            const height = bbox.height || 0;
            const dynamicOffset = Math.max(
              minOffset,
              Math.round(height * ratio),
            );
            const busY = bottom + dynamicOffset;
            try {
              const id = node.getID ? node.getID() : model.id || '';
              if (id) busMapByParentId[id] = busY;
            } catch (e) {
              // ignore id retrieval errors
            }
          }
        });

        graph.set('orgBusYMap', busMapByParentId);
        // 同步到全局变量，供边绘制直接读取（按父节点 id）
        GLOBAL_ORG_BUS_MAP = busMapByParentId;
      } catch (e) {
        // ignore
      }
    };

    // 让根节点水平居中，同时避免因居中导致右侧/左侧溢出：必要时先按根节点左右最大跨度缩小。
    const centerRootX = () => {
      try {
        const containerEl = containerRef.current;
        if (!containerEl) return;

        const nodes = graph.getNodes();
        if (!nodes || nodes.length === 0) return;

        const rootNode =
          nodes.find((n: any) => (n.getModel?.() as TreeNode)?.level === 0) ||
          nodes[0];
        if (!rootNode) return;

        const model = rootNode.getModel?.() as any;
        if (typeof model?.x !== 'number' || typeof model?.y !== 'number')
          return;

        const getCanvasPoint = () =>
          (graph as any).getCanvasByPoint
            ? (graph as any).getCanvasByPoint(model.x, model.y)
            : { x: 0, y: 0 };

        const getGroupBBox = () => {
          const group = (graph as any).get?.('group');
          return group?.getCanvasBBox?.();
        };

        const containerWidth = containerEl.clientWidth;
        const pad = 20;

        // 1) 若根节点居中后会溢出，则先基于“根节点到左右边界的最大距离”缩小。
        const rootCanvas = getCanvasPoint();
        const bbox = getGroupBBox();
        if (bbox && typeof rootCanvas?.x === 'number') {
          const leftDist = rootCanvas.x - bbox.minX;
          const rightDist = bbox.maxX - rootCanvas.x;
          const maxDist = Math.max(leftDist, rightDist);
          const halfAvail = containerWidth / 2 - pad;
          if (halfAvail > 0 && maxDist > halfAvail) {
            const factor = Math.min(1, halfAvail / maxDist);
            const currentZoom = (graph as any).getZoom?.() || 1;
            const nextZoom = currentZoom * factor;
            // 以根节点为缩放中心，避免缩放引入额外偏移
            (graph as any).zoomTo?.(nextZoom, {
              x: rootCanvas.x,
              y: rootCanvas.y,
            });
          }
        }

        // 2) 将根节点移动到容器水平中心
        const rootCanvas2 = getCanvasPoint();
        if (typeof rootCanvas2?.x !== 'number') return;
        const targetX = containerWidth / 2;
        const dx = targetX - rootCanvas2.x;
        if (Math.abs(dx) >= 1) {
          graph.translate(dx, 0);
        }

        // 3) 最后兜底 clamp，避免极小误差导致左右溢出
        const bbox2 = getGroupBBox();
        if (bbox2) {
          const minX = bbox2.minX;
          const maxX = bbox2.maxX;
          if (minX < pad) graph.translate(pad - minX, 0);
          if (maxX > containerWidth - pad)
            graph.translate(containerWidth - pad - maxX, 0);
        }

        (graph as any).paint?.();
      } catch (e) {
        // ignore
      }
    };

    // 对齐同级节点：使同一父节点下的所有子节点顶部对齐（解决高度不同导致的垂直错位），并相对于父节点水平居中。
    const alignSiblings = () => {
      try {
        const nodes = graph.getNodes();
        if (!nodes || nodes.length === 0) return;

        const parentToChildren: Record<string, any[]> = {};
        nodes.forEach((node: any) => {
          const inEdges = (node as any).getInEdges?.();
          if (inEdges && inEdges.length > 0) {
            const parent = inEdges[0].getSource();
            const pid = parent.getID();
            if (!parentToChildren[pid]) parentToChildren[pid] = [];
            parentToChildren[pid].push(node);
          }
        });

        Object.keys(parentToChildren).forEach((pid) => {
          const children = parentToChildren[pid];
          if (children.length === 0) return;

          // 1) 垂直顶部对齐 (Top Align)
          let maxTopY = -Infinity;
          children.forEach((c) => {
            const m = c.getModel() as any;
            const h =
              (Array.isArray(m.symbolSize) ? m.symbolSize[1] : 60) || 60;
            const topY = m.y - h / 2;
            if (topY > maxTopY) maxTopY = topY;
          });

          children.forEach((c) => {
            const m = c.getModel() as any;
            const h =
              (Array.isArray(m.symbolSize) ? m.symbolSize[1] : 60) || 60;
            const targetY = maxTopY + h / 2;
            if (Math.abs(m.y - targetY) > 0.5) {
              graph.updateItem(c, { y: targetY });
            }
          });

          // 2) 水平对称 (Center siblings group under parent)
          if (children.length > 0) {
            const parentNode = graph.findById(pid);
            if (parentNode) {
              const pm = parentNode.getModel() as any;
              const xs = children.map((c) => (c.getModel() as any).x);
              const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
              const dx = (pm.x || 0) - midX;
              if (Math.abs(dx) > 1) {
                const shiftSubtree = (node: any, deltaX: number) => {
                  const m = node.getModel() as any;
                  graph.updateItem(node, { x: (m.x || 0) + deltaX });
                  if (m.children && Array.isArray(m.children)) {
                    m.children.forEach((childData: any) => {
                      const childNode = graph.findById(childData.id);
                      if (childNode) shiftSubtree(childNode, deltaX);
                    });
                  }
                };
                children.forEach((c) => shiftSubtree(c, dx));
              }
            }
          }
        });
        (graph as any).refreshPositions?.();
      } catch (e) {
        // ignore
      }
    };

    graph.on('afterlayout', () => {
      alignSiblings();
      computeBusMap();
      graph.refresh();
      graph.fitView(20);
      // fitView 会改 transform，需要在其后做根节点水平居中
      centerRootX();
    });

    // 触发一次计算（如果已经完成布局）
    alignSiblings();
    computeBusMap();
    graph.fitView(20);
    centerRootX();
    updateStats(graph);
    bindTooltip(graph, tooltipRef);

    // 作用是在布局完成后再调整视图和更新统计数据
    // const refreshLayout = (g: IGraph) => {
    //   g.layout();
    //   g.fitView(20);
    //   updateStats(g);
    // };

    // bindCollapse(graph, refreshLayout);

    const handleResize = () => {
      if (!graphRef.current || !containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      graphRef.current.changeSize(clientWidth, clientHeight);
      graphRef.current.fitView(20);
      centerRootX();
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

  const handleZoom = (ratio: number) => {
    const graph = graphRef.current;
    const container = containerRef.current;
    if (!graph || !container) return;
    const center = {
      x: container.clientWidth / 2,
      y: container.clientHeight / 2,
    };
    graph.zoom(ratio, center);
  };

  // const handleFitView = () => {
  // 	graphRef.current?.fitView(20)
  // }

  const handleExport = () => {
    graphRef.current?.downloadImage('org-chart.png');
  };

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
					<Button className="btn" onClick={handleSearch}>
						搜索
					</Button>
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
      <div>
        <Button className="btn " onClick={() => handleZoom(1.1)}>
          放大
        </Button>
        <Button className={styles['ml-12']} onClick={() => handleZoom(0.9)}>
          缩小
        </Button>
        <Button
          className={`btn btn-export ${styles['ml-12']}`}
          onClick={handleExport}
        >
          导出图片
        </Button>
      </div>
      <div
        className={styles.chartContainer}
        ref={containerRef}
        style={{
          background: '#ffffff',
          border: '1px solid #007aff',
          borderRadius: 8,
          margin: '16px 0',
        }}
      />
      {/* 
			<div className="controls">
				<Button className="btn" onClick={() => handleZoom(1.1)}>放大</Button>
				<Button className="btn" onClick={() => handleZoom(0.9)}>缩小</Button>
				<Button className="btn" onClick={handleFitView}>适应屏幕</Button>
				<Button className="btn btn-export" onClick={handleExport}>导出图片</Button>
				<Button className="btn btn-expand" onClick={() => toggleAll(false)}>展开全部</Button>
				<Button className="btn" onClick={() => toggleAll(true)}>折叠全部</Button>
				<Button className="btn btn-reset" onClick={handleReset}>重置视图</Button>
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
