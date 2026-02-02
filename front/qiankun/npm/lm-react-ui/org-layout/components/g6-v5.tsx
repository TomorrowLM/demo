import {
  Badge,
  BaseBehavior,
  ExtensionCategory,
  Graph,
  Label,
  Rect,
  register,
  treeToGraphData,
} from '@antv/g6';
import { Button, Space } from 'antd';
import styles from '../index.less';

const statusColors = {
  online: '#17BEBB',
  busy: '#E36397',
  offline: '#B7AD99',
};

const DEFAULT_LEVEL = 'detailed';
const deptNameFontSize = 18; //默认名字字体大小
const defaultNameFontSize = 16; //默认名字字体大小
const tagFontSize = 10; //默认标签字体大小
const tipFontSize = 12; //tip字体大小
const tipTopDistance = 20; //tip距离name的高度
const tagGap = 8; // 不同 tag 间距
const horizontalGap = 8; // name 与第一个 tag 之间的间距

const uuidCreate = (len = 16) => {
  // 生成 len 位的十六进制随机字符串
  return 'x'.repeat(len).replace(/x/g, function () {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
};

/**
 * Draw a chart node with different ui based on the zoom level.
 */
class ChartNode extends Rect {
  get data() {
    // 尝试多种方式获取节点数据：优先使用实例的 model（this.getModel），其次使用 context.model
    try {
      // 有些 G6 版本在 node 实例上没有 `getModel` 方法，使用可选调用以避免抛出
      const ownModel = (this as any).getModel?.() ?? null;
      if (ownModel) return ownModel?.data ?? ownModel;
    } catch (e) {
      // ignore
    }
    const model = this.context?.model?.getElementDataById?.(this.id);
    return model?.data ?? model ?? {};
  }

  get level() {
    return this.data?.level || DEFAULT_LEVEL;
  }

  getKeyStyle(attributes: any) {
    const statusValue =
      typeof this.data?.status === 'string' ? this.data.status : '';
    const status = (
      ['online', 'busy', 'offline'].includes(statusValue)
        ? statusValue
        : 'offline'
    ) as keyof typeof statusColors;
    return {
      ...super.getKeyStyle(attributes),
      fill: this.level === 'overview' ? statusColors[status] : '#F5FAFF',
    };
  }

  getStatusStyle() {
    if (this.level === 'overview') return false;
    const statusValue =
      typeof this.data?.status === 'string' ? this.data.status : '';
    const status = (
      ['online', 'busy', 'offline'].includes(statusValue)
        ? statusValue
        : 'offline'
    ) as keyof typeof statusColors;
    return {
      text: status,
      fontSize: 8,
      textAlign: 'left' as const,
      transform: [['translate', 40, -16]] as any,
      padding: [0, 4],
      fill: '#fff',
      backgroundFill: statusColors[status],
    };
  }

  drawStatusShape(container: any) {
    const statusStyle = this.getStatusStyle();
    this.upsert('status', Badge, statusStyle, container);
  }

  getAvatarsStyles(dataItem, container, nodeHeight) {
    console.log('getAvatarsStyles', dataItem.name, dataItem);
    let nameFontSize = dataItem.isDept ? deptNameFontSize : defaultNameFontSize;
    let distance = nameFontSize; // 计算name的高度
    const styleName = {
      id: `name-${dataItem.id}`,
      text: dataItem.name,
      fontSize: nameFontSize,
      textAlign: 'center' as const,
      y: nodeHeight,
      // 不做省略，尽量展示完整文本；限制一个很大的 maxWidth 避免被默认裁切
      maxWidth: 10000,
      textOverflow: 'clip',
      whiteSpace: 'nowrap' as any,
      fill: '#191F25FF',
      // transform: [['translate', -60, nodeHeight]] as any,
      // padding: [6],
      // backgroundFill: '#aaa',
    };
    this.upsert(styleName.id, Badge, styleName, container);
    if (dataItem.tip) {
      const styleTip = {
        id: `tip-${dataItem.id}`,
        text: dataItem.tip,
        fontSize: tipFontSize,
        textAlign: 'center' as const,
        y: nodeHeight + tipTopDistance,
        maxWidth: 1000,
        textOverflow: 'clip',
        whiteSpace: 'nowrap' as any,
        fill: '#191F2599',
      };
      this.upsert(styleTip.id, Label, styleTip, container);
      distance += tipTopDistance + tipFontSize;
    }
    // 把 name 保持居中（x=0），tag 从 name 右侧开始并水平排布，防止重叠
    const nameWidth = String(dataItem.name || '').length * nameFontSize;
    dataItem?.tag?.forEach((tagItem: any, idx: number) => {
      const tagTextLen = String(tagItem.name || '').length;
      const tagWidthEst = Math.ceil(tagTextLen * tagFontSize) + 16; // 估算 tag 宽度（含 padding）
      // 以 name 右侧为起点，按索引叠加偏移
      const baseX = Math.ceil(nameWidth / 2) + horizontalGap;
      const tagCenterX =
        baseX + idx * (tagWidthEst + tagGap) + Math.ceil(tagWidthEst / 2);
      const tagY = nodeHeight; // 跟 name 在同一行
      const tagStyle = {
        id: `tag-${dataItem.name}-${idx}`,
        text: tagItem.name,
        fontSize: 8,
        x: tagCenterX,
        y: tagY,
        textAlign: 'center' as const,
        padding: [4, 8],
        fill: '#fff',
        // stroke: '#FC622180',
        lineWidth: 1,
        borderRadius: 2,
        backgroundFill: '#FC6221',
        maxWidth: 400,
        textOverflow: 'clip',
        whiteSpace: 'nowrap' as any,
      };
      this.upsert(tagStyle.id, Badge, tagStyle, container);
    });
    console.log(
      'nodeHeight before update:',
      dataItem.name,
      distance,
      nodeHeight,
      dataItem.mb ? dataItem.mb : 0,
      Number(nodeHeight) + Number(distance) + Number(dataItem.isDept ? 30 : 0),
    );
    return (
      Number(nodeHeight) + Number(distance) + Number(dataItem.isDept ? 30 : 0)
    ); // 返回更新后的 nodeHeight
  }

  // startY: absolute y within node coordinate (node center is 0);
  // pass a negative startY to begin from node top (e.g. -height/2 + padding)
  drawAvatarsShape(container: any, startY?: number) {
    console.log('drawAvatarsShape', this.data.data, 'startY', startY);
    let nodeHeight = typeof startY === 'number' ? startY : 0;
    if (!this.data.data) return false;
    this.data.data.forEach((item: any) => {
      const nodeHeightNew = this.getAvatarsStyles(item, container, nodeHeight);
      nodeHeight = nodeHeightNew;
    });
  }
  render(attributes: any = this.parsedAttributes, container: any = this) {
    console.log('ChartNode render', this.data, this.level);
    attributes.size = [this.data.width || 150, this.data.height || 60];
    super.render(attributes, container);
    // 以节点顶部为起点向下排列：节点坐标系以中心为原点，顶部 y = -height/2
    const nodeHeightStart = -(attributes.size?.[1] || 60) / 2 + 16; // 16px 顶部内边距
    this.drawAvatarsShape(container, nodeHeightStart);
    // this.drawPhoneShape(container);
    // this.drawPositionShape(container);
    // this.drawStatusShape(container);
  }
}

/**
 * Implement a level of detail rendering, which will show different details based on the zoom level.
 */
class LevelOfDetail extends BaseBehavior {
  prevLevel = DEFAULT_LEVEL;
  levels = {
    ['overview']: [0, 0.6],
    ['detailed']: [0.6, Infinity],
  };

  // constructor(context: any, options: any) {
  //   super(context, options);
  //   // this.bindEvents();
  // }

  update(options: any) {
    // this.unbindEvents();
    super.update(options);
    // this.bindEvents();
  }

  // updateZoomLevel = async (e: any) => {
  //   if ('scale' in e.data) {
  //     const scale = e.data.scale;
  //     const level = Object.entries(this.levels).find(([_, [min, max]]) => scale > min && scale <= max)?.[0];
  //     if (level && this.prevLevel !== level) {
  //       const { graph } = this.context;
  //       graph.updateNodeData((prev: any[]) => prev.map((node) => ({ ...node, data: { ...node.data, level } })));
  //       await graph.draw();
  //       this.prevLevel = level;
  //     }
  //   }
  // };

  // bindEvents() {
  //   const { graph } = this.context;
  //   graph.on(GraphEvent.AFTER_TRANSFORM, this.updateZoomLevel);
  // }

  // unbindEvents() {
  //   const { graph } = this.context;
  //   graph.off(GraphEvent.AFTER_TRANSFORM, this.updateZoomLevel);
  // }

  destroy() {
    // this.unbindEvents();
    super.destroy();
  }
}

const trsformData = (data: any) => {
  // 把 treeData.ts 的格式转换为本文件需要的格式：{ id, data: { width,height,data: [...] }, children }
  let idCounter = 0;
  const rowHeight = 50; // 与 ChartNode 中每行占用高度保持一致

  // 生成唯一 id
  function nextId(prefix = 'node') {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
  }
  // 规范化 name 列表
  function normalizeNameList(node: any) {
    // 返回一个 items 数组，每项包含 { name, tip?, tag? }
    if (Array.isArray(node?.name)) {
      return node.name.map((n: any) =>
        typeof n === 'string'
          ? { name: n, id: uuidCreate(16) }
          : { ...n, id: n.id || uuidCreate(16) },
      );
    }
    if (typeof node?.name === 'string')
      return [{ name: node.name, tip: node.tip, id: uuidCreate(16) }];
    // fallback: if node has fields like name/tip
    if (node && (node.name || node.tip))
      return [{ name: node.name || '', tip: node.tip, id: uuidCreate(16) }];
    return [];
  }

  // 估算节点尺寸
  function measureNode(items: any[]) {
    // 估算宽度：基于最长文本和标签
    let maxTextLen = 0;
    items.forEach((it) => {
      if (typeof it.name === 'string')
        maxTextLen = Math.max(maxTextLen, it.name.length);
      if (typeof it.tip === 'string')
        maxTextLen = Math.max(maxTextLen, it.tip.length);
      if (Array.isArray(it.tag)) {
        it.tag.forEach((t: any) => {
          if (typeof t.name === 'string')
            maxTextLen = Math.max(maxTextLen, t.name.length);
        });
      }
    });
    const estimatedWidth = Math.max(
      150,
      Math.ceil(maxTextLen * defaultNameFontSize) + 100,
    );
    const estimatedHeight = Math.max(60, items.length * rowHeight + 16 * 2);
    return { width: estimatedWidth, height: estimatedHeight };
  }

  function transform(node: any): any {
    const items = normalizeNameList(node);
    items[0].isDept = true; // 第一个是部门名称，给个底边距
    const { width, height } = measureNode(items);
    const out: any = {
      id: node.id || nextId('n'),
      data: {
        width,
        height,
        data: items,
      },
    };
    if (Array.isArray(node.children) && node.children.length) {
      out.children = node.children.map((c: any) => transform(c));
    }
    return out;
  }

  // if incoming `data` is already in target shape, just return
  try {
    if (data && data.id && data.data && (data.data.data || data.data.width))
      return data;
  } catch (e) {
    // ignore
  }

  return transform(data);
};

const OrgLayoutPage: React.FC<{ data: any }> = ({ data }) => {
  // register custom node and behavior BEFORE creating the graph
  register(ExtensionCategory.NODE, 'chart-node', ChartNode);
  register(ExtensionCategory.BEHAVIOR, 'level-of-detail', LevelOfDetail);
  console.log('OrgLayoutPage data:', data);
  data.name[0].name += '组织架构图';
  const dataNew = trsformData(data);
  const treeData = treeToGraphData(dataNew);

  // 预先计算每个 depth 层的统一 posY，实现顶部对齐
  const calcPosYByDepth =
    // 为每个 depth 层计算统一的 top 对齐 posY，并写入每个节点的 posY 字段
    () => {
      try {
        const TOP_OFFSET = 0; // 整体向下偏移
        const RANKSEP = 200; // 与 layout.ranksep 保持一致
        const nodes = (treeData as any).nodes || [];
        const groups = new Map<number, any[]>(); // 按 depth 分组，便于后续计算每个层级的最大高度
        console.log('calcPosYByDepth nodes', nodes);
        nodes.forEach((n: any) => {
          const depth = typeof n.depth === 'number' ? n.depth : 0;
          if (!groups.has(depth)) groups.set(depth, []);
          groups.get(depth)!.push(n);
        });
        const depths = Array.from(groups.keys()).sort((a, b) => a - b);
        let cumulativeTop = TOP_OFFSET; // 累计的 top
        depths.forEach((d) => {
          const entries = groups.get(d) || [];
          console.log('[calcPosYByDepth] entries for depth', d, entries);
          // 计算本层最大高度用于下一层的 offset
          const maxH =
            entries.reduce((acc: number, node: any) => {
              const h = Array.isArray(node.size)
                ? node.size[1]
                : node.data?.height;
              return Math.max(acc, Number(h || 60));
            }, 0) || 60;
          console.log('[calcPosYByDepth] maxH for depth', d, maxH);
          // 为实现顶部对齐：对每个节点使用其自身高度计算 centerY = cumulativeTop + nodeHeight/2
          entries.forEach((node: any) => {
            const nodeH = Array.isArray(node.size)
              ? Number(node.size[1] || 60)
              : Number(node.data?.height || 60);
            node.posY = cumulativeTop + nodeH / 2; // 写入 posY，供 layout/style 使用
          });
          cumulativeTop += maxH + RANKSEP;
        });
        console.log('[calcPosYByDepth] posY calculated for depths', depths);
      } catch (e) {
        console.warn('[calcPosYByDepth] failed', e);
      }
    };
  calcPosYByDepth();
  console.log('Transformed data:', dataNew, treeData);
  const graph = new Graph({
    container: 'container',
    data: treeData,
    node: {
      type: 'chart-node',
      style: {
        // 设置节点之间的间距，避免重叠
        size: (d) => {
          return [d.data.width, d.data.height];
        }, // 确保这里返回的尺寸是准确的
        labelPlacement: 'center',
        lineWidth: 1,
        ports: [{ placement: 'top' }, { placement: 'bottom' }],
        radius: 2,
        shadowBlur: 10,
        shadowColor: '#e0e0e0',
        shadowOffsetX: 3,
        stroke: '#F5FAFF',
        fill: '#F5FAFF',
        // 使用预先计算的 posY 实现按 depth 层顶部对齐
        y: (d) => {
          console.log('node style y for', d.id, 'posY=', d.posY);
          return d.id === 'n-1' ? 0 : d.posY ? d.posY : null;
        },
      },
    },
    edge: {
      type: 'polyline',
      style: {
        router: {
          type: 'orth',
        },
        stroke: '#007aff',
        lineWidth: 4,
      },
    },
    // ... 其他配置
    layout: {
      type: 'dagre', // 或 'force'
      preventOverlap: true, // 关键：启用防重叠
      // 使用更大间距，确保节点与子节点之间不会重叠
      nodesep: 80,
      ranksep: 0, // 增加层间距，避免节点重叠
    },
    autoFit: 'view',
    // 移除 'zoom-canvas' 行为以禁用滚轮缩放，仍保留缩放按钮
    behaviors: ['level-of-detail', 'drag-canvas'],
  });
  // 强制在布局完成后按同级顶部对齐：按 depth 分组，计算每层最小 top，然后更新所有节点 y
  // const forceTopAlignAfterLayout = () => {
  //   const doAlign = () => {
  //     try {
  //       if (typeof graph.getNodes !== 'function') return;
  //       const nodes = graph.getNodes();
  //       const groups = new Map<number, any[]>();
  //       nodes.forEach((node: any) => {
  //         const m = node.getModel ? node.getModel() : node.model;
  //         const depth = typeof m.depth === 'number' ? m.depth : 0;
  //         if (!groups.has(depth)) groups.set(depth, []);
  //         groups.get(depth)!.push(node);
  //       });
  //       groups.forEach((entries) => {
  //         if (!entries || entries.length === 0) return;
  //         const tops = entries.map((node: any) => {
  //           const m = node.getModel ? node.getModel() : node.model;
  //           const size = Array.isArray(m.size)
  //             ? m.size
  //             : m.data && m.data.height
  //               ? [m.data.width || 150, m.data.height]
  //               : [150, 60];
  //           const h = Number(size[1] || 60);
  //           const centerY = Number(m.y || 0);
  //           return centerY - h / 2;
  //         });
  //         const minTop = Math.min(...tops);
  //         entries.forEach((node: any) => {
  //           const m = node.getModel ? node.getModel() : node.model;
  //           const size = Array.isArray(m.size)
  //             ? m.size
  //             : m.data && m.data.height
  //               ? [m.data.width || 150, m.data.height]
  //               : [150, 60];
  //           const h = Number(size[1] || 60);
  //           const newY = minTop + h / 2;
  //           try {
  //             graph.updateItem(node, { x: m.x, y: newY });
  //           } catch (e) {
  //             console.warn('[forceAlign] updateItem failed', e, m);
  //           }
  //         });
  //       });
  //       if (typeof graph.refresh === 'function') graph.refresh();
  //       else if (typeof (graph as any).refreshPositions === 'function')
  //         (graph as any).refreshPositions();
  //       setTimeout(() => {
  //         try {
  //           console.log(
  //             '[forceAlign] post-align positions:',
  //             graph
  //               .getNodes()
  //               .map((n: any) => (n.getModel ? n.getModel() : n.model)),
  //           );
  //         } catch (e) {
  //           console.warn('[forceAlign] post-align log failed', e);
  //         }
  //       }, 30);
  //     } catch (e) {
  //       console.warn('[forceAlign] error', e);
  //     }
  //   };

  //   graph.once('afterlayout', () => {
  //     requestAnimationFrame(() => setTimeout(doAlign, 20));
  //   });
  //   // 备选：如果 afterlayout 没有触发，还是在渲染后尝试
  //   graph.once('afterrender', () => {
  //     requestAnimationFrame(() => setTimeout(doAlign, 50));
  //   });
  //   // 后备定时器
  //   setTimeout(() => doAlign(), 300);
  // };
  graph.render();
  // forceTopAlignAfterLayout();

  // 禁用滚轮触发的放大/缩小：在容器上拦截 wheel 事件并阻止默认行为
  try {
    const containerEl = document.getElementById('container');
    if (containerEl) {
      const _wheelHandler = (e: WheelEvent) => {
        // 阻止默认，以避免 G6 响应滚轮进行缩放
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      // 使用 passive: false 以允许 preventDefault
      containerEl.addEventListener('wheel', _wheelHandler as any, {
        passive: false,
      });
    }
  } catch (e) {
    // ignore
  }

  // expose graph for console/debugging
  try {
    (window as any).__G6_GRAPH__ = graph;
  } catch (e) {
    // ignore
  }

  // toolbar handlers (use closures over `graph` and container)
  const handleZoom = (factor: number) => {
    try {
      // read current zoom and compute target
      // const getZoom = (graph as any).getZoom || (graph as any).getZoomed?.bind(graph);
      const current =
        typeof (graph as any).getZoom === 'function'
          ? (graph as any).getZoom()
          : (graph as any).get('zoom') || 1;
      const target = Number(current) * Number(factor);
      const containerEl = document.getElementById('container');
      const center = containerEl
        ? { x: containerEl.clientWidth / 2, y: containerEl.clientHeight / 2 }
        : undefined;
      if (typeof (graph as any).zoomTo === 'function') {
        if (center) (graph as any).zoomTo(target, center);
        else (graph as any).zoomTo(target);
      } else if (typeof (graph as any).zoom === 'function') {
        // some versions accept absolute scale in zoom(...)
        if (center) (graph as any).zoom(target, center);
        else (graph as any).zoom(target);
      } else {
        console.warn('no zoom function available on graph');
      }
    } catch (e) {
      console.warn('handleZoom failed', e);
    }
  };

  // 导出图片
  const handleExport = async () => {
    const dataURL = await graph.toDataURL();
    const [head, content] = dataURL.split(',');
    const contentType = head.match(/:(.*?);/)![1];

    const bstr = atob(content);
    let length = bstr.length;
    const u8arr = new Uint8Array(length);

    while (length--) {
      u8arr[length] = bstr.charCodeAt(length);
    }

    const blob = new Blob([u8arr], { type: contentType });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '组织架构图.png';
    a.click();
  };
  // 在渲染完成后执行一次图调整（适配视图或触发初始缩放）
  try {
    graph.once('afterrender', () => {
      try {
        // handleZoom(0.9);
        // if (typeof graph.fitView === 'function') {
        // graph.fitView(10);
        // } else {
        //   // fallback to handleZoom with factor 1 (no-op) to ensure zoom-related code path runs
        //   try {
        //     handleZoom(1);
        //   } catch (e) {
        //     console.warn('post-render handleZoom failed', e);
        //   }
        // }
      } catch (e) {
        console.warn('post-render adjustment failed', e);
      }
    });
  } catch (e) {
    console.warn('register afterrender handler failed', e);
  }
  //   // 顶部对齐
  //   const handleAlignNow = () => {
  //     try {
  //       // reuse force align logic: group by depth and align tops
  //       if (typeof graph.getNodes !== 'function') return;
  //       const nodes = graph.getNodes();
  //       const groups = new Map<number, any[]>();
  //       nodes.forEach((node: any) => {
  //         const m = node.getModel ? node.getModel() : node.model;
  //         const depth = typeof m.depth === 'number' ? m.depth : 0;
  //         if (!groups.has(depth)) groups.set(depth, []);
  //         groups.get(depth)!.push(node);
  //       });
  //       groups.forEach((entries) => {
  //         if (!entries || entries.length === 0) return;
  //         const tops = entries.map((node: any) => {
  //           const m = node.getModel ? node.getModel() : node.model;
  //           const size = Array.isArray(m.size)
  //             ? m.size
  //             : m.data && m.data.height
  //               ? [m.data.width || 150, m.data.height]
  //               : [150, 60];
  //           const h = Number(size[1] || 60);
  //           const centerY = Number(m.y || 0);
  //           return centerY - h / 2;
  //         });
  //         const minTop = Math.min(...tops);
  //         entries.forEach((node: any) => {
  //           const m = node.getModel ? node.getModel() : node.model;
  //           const size = Array.isArray(m.size)
  //             ? m.size
  //             : m.data && m.data.height
  //               ? [m.data.width || 150, m.data.height]
  //               : [150, 60];
  //           const h = Number(size[1] || 60);
  //           const newY = minTop + h / 2;
  //           try {
  //             graph.updateItem(node, { x: m.x, y: newY });
  //           } catch (e) {
  //             console.warn('[handleAlignNow] updateItem failed', e, m);
  //           }
  //         });
  //       });
  //       if (typeof graph.refresh === 'function') graph.refresh();
  //       else if (typeof (graph as any).refreshPositions === 'function') (graph as any).refreshPositions();
  //     } catch (e) {
  //       console.warn('handleAlignNow failed', e);
  //     }
  //   };
  //  //  适应视图
  //   const handleFit = () => {
  //     try {
  //       if (typeof graph.fitView === 'function') graph.fitView(20);
  //     } catch (e) {
  //       console.warn('handleFit failed', e);
  //     }
  //   };
  return (
    <div className={styles.container}>
      <Space>
        <Button className="btn" onClick={() => handleZoom(1.1)}>
          放大
        </Button>
        <Button className="btn" onClick={() => handleZoom(0.9)}>
          缩小
        </Button>
        {/* <Button className="btn" onClick={handleFit}>
          适应视图
        </Button>
        <Button className="btn" onClick={handleAlignNow}>
          顶部对齐
        </Button> */}
        <Button className="btn btn-export" onClick={handleExport}>
          导出图片
        </Button>
      </Space>
      <div id="container" className={styles.orgContainer}></div>
    </div>
  );
};
export default OrgLayoutPage;
