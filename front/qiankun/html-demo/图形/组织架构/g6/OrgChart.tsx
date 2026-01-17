import React, { useEffect, useRef, useState } from 'react';
import './style.css';

// 从data.js导入数据 - 这里我们直接复制数据，或者可以导入
const treeData = {
  name: '公司',
  symbolSize: [260, 90],
  bg: '#3949f7',
  color: '#fff',
  fontSize: 33,
  children: [
    {
      name: [
        { name: 'name1', tip: 'tips' },
        { name: 'name2', tip: 'tips', tag: [{ name: '产品2', borderColor: '#FC6221', color: '#FC6221' }] },
        { name: 'name1', tip: 'tips' },
      ],
      color: '#2b2f8f',
      children: [
        { name: '产品规划', tip: 'tips', symbolSize: [120, 40], color: '#2b2f8f' },
        { name: '需求分析', tip: 'tips', symbolSize: [120, 40], color: '#2b2f8f' },
        { name: '产品运营', tip: 'tips', symbolSize: [120, 40], color: '#2b2f8f' },
      ],
    },
    {
      name: '研发',
      symbolSize: [160, 48],
      color: '#2b2f8f',
      children: [
        {
          name: '前端',
          symbolSize: [120, 40],
          color: '#2b2f8f',
          children: [
            { name: 'Vue', symbolSize: [100, 36], color: '#2b2f8f' },
            { name: 'React', symbolSize: [100, 36], color: '#2b2f8f' },
          ],
        },
        {
          name: '后端',
          symbolSize: [120, 40],
          color: '#2b2f8f',
          children: [
            { name: 'Java', symbolSize: [100, 36], color: '#2b2f8f' },
            { name: 'Node.js', symbolSize: [100, 36], color: '#2b2f8f' },
          ],
        },
        { name: '测试', symbolSize: [120, 40], color: '#2b2f8f' },
      ],
    },
    {
      name: '设计1111111111111111111111111111111111',
      symbolSize: [160, 48],
      color: '#2b2f8f',
      children: [
        { name: '视觉', symbolSize: [120, 40], color: '#2b2f8f' },
        { name: '交互', symbolSize: [120, 40], color: '#2b2f8f' },
      ],
    },
    {
      name: '运营',
      symbolSize: [160, 48],
      color: '#2b2f8f',
      children: [
        { name: '市场', symbolSize: [120, 40], color: '#2b2f8f' },
        { name: '内容', symbolSize: [120, 40], color: '#2b2f8f' },
      ],
    },
  ],
};

// 声明G6类型
interface G6Type {
  registerNode: (name: string, config: any) => void;
  TreeGraph: any;
  Arrow: {
    triangle: (width: number, height: number, offset: number) => any;
  };
}

declare global {
  interface Window {
    G6: G6Type;
  }
}

const OrgChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [stats, setStats] = useState({
    nodeCount: 0,
    edgeCount: 0,
    levelCount: 0,
  });

  // 动态加载G6库
  useEffect(() => {
    const loadG6 = (): Promise<void> => {
      if (window.G6) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@antv/g6@4.8.22/dist/g6.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load G6'));
        document.head.appendChild(script);
      });
    };

    loadG6().then(() => {
      if (containerRef.current) {
        initGraph();
      }
    });

    return () => {
      if (graphRef.current) {
        graphRef.current.destroy();
      }
    };
  }, []);

  // 计算节点尺寸
  const calculateNodeSize = (data: any) => {
    const defaultWidth = Array.isArray(data.symbolSize)
      ? data.symbolSize[0]
      : (typeof data.symbolSize === 'number' ? data.symbolSize : 200);

    const baseHeight = Array.isArray(data.symbolSize)
      ? data.symbolSize[1]
      : (typeof data.symbolSize === 'number' ? data.symbolSize : 60);

    const nameArray = Array.isArray(data.name) ? data.name : [{ name: data.name || '', tag: data.tag }];

    let lines = 0;
    nameArray.forEach((item: any) => {
      const text = item.name || '';
      const displayText = text.length > 20 ? `${text.substring(0, 18)}...` : text;
      const lineCount = Math.max(1, Math.ceil(displayText.length / 12));
      lines += lineCount;

      if (item.tip) {
        lines += 1;
      }

      if (item.tag && item.tag.length > 0) {
        lines += 1;
      }
    });

    const lineHeight = 22;
    const padding = 35;
    const computedHeight = padding + lines * lineHeight;

    return [defaultWidth, Math.max(baseHeight, computedHeight)];
  };

  // 注册自定义节点
  const registerCustomNode = () => {
    if (!window.G6) return;

    window.G6.registerNode('org-node', {
      draw(cfg: any, group: any) {
        const { symbolSize = [120, 40], color, bg, fontSize = 14, textColor } = cfg;
        const [width, height] = Array.isArray(symbolSize) ? symbolSize : [symbolSize, symbolSize];

        const fillColor = bg || '#F5FAFF';
        const accentColor = color || '#2b2f8f';
        const resolvedTextColor = textColor || (fillColor === '#F5FAFF' ? '#1f2d3d' : '#fff');

        // 添加阴影效果
        const shadow = group.addShape('rect', {
          attrs: {
            x: -width / 2 + 2,
            y: -height / 2 + 2,
            width,
            height,
            fill: '#000',
            opacity: 0.1,
            radius: 6,
          },
          name: 'shadow-shape',
        });

        // 主矩形背景
        const rect = group.addShape('rect', {
          attrs: {
            x: -width / 2,
            y: -height / 2,
            width,
            height,
            fill: fillColor,
            stroke: '#fff',
            lineWidth: 2,
            radius: 6,
            cursor: 'pointer',
          },
          name: 'rect-shape',
        });

        // 添加渐变效果
        if (cfg.level === 0) {
          rect.attr('fill', 'l(0) 0:#3949f7 1:#2b2f8f');
        }

        // 处理 name 数据
        let nameArray: any[] = [];
        if (Array.isArray(cfg.name)) {
          nameArray = cfg.name;
        } else {
          nameArray = [{ name: cfg.name, tip: cfg.tip }];
        }

        // 绘制多行文本
        let currentY = -height / 2 + 25;
        const lineHeight = 22;

        nameArray.forEach((item: any, index: number) => {
          const textContent = item.name || '';

          // 处理长文本 - 自动换行
          let displayText = textContent;
          let lines: string[] = [];

          if (textContent.length > 12) {
            if (textContent.length > 20) {
              displayText = textContent.substring(0, 18) + '...';
            }
            for (let i = 0; i < displayText.length; i += 12) {
              lines.push(displayText.substring(i, i + 12));
            }
          } else {
            lines = [displayText];
          }

          // 绘制文本行
          lines.forEach((line: string, lineIndex: number) => {
            group.addShape('text', {
              attrs: {
                x: 0,
                y: currentY + (lineIndex * lineHeight),
                text: line,
                fontSize: fontSize - (index > 0 ? 4 : 0),
                fill: resolvedTextColor,
                textAlign: 'center',
                textBaseline: 'middle',
                fontWeight: index === 0 ? 'bold' : 'normal',
                cursor: 'pointer',
              },
              name: `text-${index}-${lineIndex}`,
            });
          });

          // 行内 tip 展示在名称下方
          if (item.tip) {
            const tipY = currentY + (lines.length * lineHeight) + 10;
            group.addShape('text', {
              attrs: {
                x: 0,
                y: tipY,
                text: item.tip,
                fontSize: 11,
                fill: '#191f2599',
                textAlign: 'center',
                textBaseline: 'middle',
              },
              name: `tip-text-${index}`,
            });
          }

          // 如果有标签
          if (item.tag && item.tag.length > 0) {
            item.tag.forEach((tag: any, tagIndex: number) => {
              const tagText = tag.name || '';
              const tagWidth = Math.max(tagText.length * 9 + 20, 60);
              const tagX = width / 2 - tagWidth - 10;
              const tagY = currentY - 11;

              // 标签背景
              const tagRect = group.addShape('rect', {
                attrs: {
                  x: tagX,
                  y: tagY,
                  width: tagWidth,
                  height: 22,
                  fill: '#fff',
                  stroke: tag.borderColor || '#FC6221',
                  lineWidth: 1.5,
                  radius: 4,
                },
                name: `tag-rect-${tagIndex}`,
              });

              // 标签文字
              group.addShape('text', {
                attrs: {
                  x: tagX + tagWidth / 2,
                  y: tagY + 11,
                  text: tagText,
                  fontSize: 10,
                  fill: tag.color || '#FC6221',
                  textAlign: 'center',
                  textBaseline: 'middle',
                  fontWeight: 'bold',
                },
                name: `tag-text-${tagIndex}`,
              });
            });
          }

          const tipExtra = item.tip ? 18 : 0;
          currentY += lines.length * lineHeight + tipExtra + (item.tag ? 14 : 0) + 6;
        });

        // 添加小图标（根据层级）
        if (cfg.children && cfg.children.length > 0) {
          group.addShape('circle', {
            attrs: {
              x: width / 2 - 10,
              y: 0,
              r: 6,
              fill: '#fff',
              stroke: accentColor,
              lineWidth: 2,
            },
            name: 'expand-icon',
          });

          group.addShape('text', {
            attrs: {
              x: width / 2 - 10,
              y: 0,
              text: '+',
              fontSize: 10,
              fill: accentColor,
              textAlign: 'center',
              textBaseline: 'middle',
              fontWeight: 'bold',
            },
            name: 'expand-text',
          });
        }

        return rect;
      },

      // 更新节点状态
      update(cfg: any, node: any) {
        const group = node.getContainer();
        const rect = group.find((ele: any) => ele.get('name') === 'rect-shape');

        if (cfg.style) {
          rect.attr(cfg.style);
        }
      }
    });
  };

  // 初始化图表
  const initGraph = () => {
    if (!containerRef.current || !window.G6) return;

    // 清除旧实例
    if (graphRef.current) {
      graphRef.current.destroy();
    }

    registerCustomNode();

    const container = containerRef.current;
    graphRef.current = new window.G6.TreeGraph({
      container: container,
      width: container.clientWidth,
      height: container.clientHeight,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node']
      },
      defaultNode: {
        type: 'org-node',
      },
      defaultEdge: {
        type: 'cubic-vertical',
        style: {
          stroke: '#aab7c4',
          lineWidth: 2,
          endArrow: {
            path: window.G6.Arrow.triangle(8, 8, 0),
            fill: '#aab7c4',
          },
        },
      },
      layout: {
        type: 'compactBox',
        direction: 'TB',
        getId: function getId(d: any) {
          return d.id;
        },
        getHeight: function getHeight(d: any) {
          return Array.isArray(d.symbolSize) ? d.symbolSize[1] : 60;
        },
        getWidth: function getWidth(d: any) {
          return Array.isArray(d.symbolSize) ? d.symbolSize[0] : 200;
        },
        getVGap: function getVGap() {
          return 50;
        },
        getHGap: function getHGap() {
          return 80;
        },
      },
      animate: true,
      animateCfg: {
        duration: 500,
        easing: 'easeLinear',
      },
    });

    // 数据处理函数
    const processData = (data: any, level = 0, parentId: string | null = null) => {
      const id = parentId ? `${parentId}-${Math.random().toString(36).substr(2, 9)}` : 'root';

      const node = {
        id: id,
        label: typeof data.name === 'string' ? data.name : '多行文本',
        level: level,
        ...data,
        symbolSize: calculateNodeSize(data),
      };

      if (data.children && data.children.length > 0) {
        node.children = data.children.map((child: any) =>
          processData(child, level + 1, id)
        );
        node.collapsed = level >= 2;
      }

      return node;
    };

    // 处理数据并渲染
    const processedData = processData(treeData);
    graphRef.current.data(processedData);
    graphRef.current.render();

    // 更新统计信息
    updateStats();

    // 绑定事件
    bindEvents();
  };

  // 更新统计信息
  const updateStats = () => {
    if (!graphRef.current) return;

    const nodes = graphRef.current.getNodes();
    const edges = graphRef.current.getEdges();

    // 计算最大层级
    let maxLevel = 0;
    nodes.forEach((node: any) => {
      const level = node.getModel().level || 0;
      if (level > maxLevel) maxLevel = level;
    });

    setStats({
      nodeCount: nodes.length,
      edgeCount: edges.length,
      levelCount: maxLevel + 1,
    });
  };

  // 绑定事件
  const bindEvents = () => {
    if (!graphRef.current) return;

    // 节点鼠标移入
    graphRef.current.on('node:mouseenter', (evt: any) => {
      const node = evt.item;
      const model = node.getModel();

      // 高亮节点
      graphRef.current.setItemState(node, 'hover', true);

      // 显示 tooltip
      const tip = model.tip || (Array.isArray(model.name)
        ? (model.name.find((n: any) => n && n.tip)?.tip || '')
        : '');
      if (tip && tooltipRef.current) {
        const point = graphRef.current.getClientByPoint(evt.x, evt.y);
        tooltipRef.current.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 5px;">${model.label || '节点信息'}</div>
          <div>${tip}</div>
          ${model.level !== undefined ? `<div style="margin-top: 5px; color: #95a5a6;">层级: ${model.level + 1}</div>` : ''}
        `;
        tooltipRef.current.style.left = point.x + 15 + 'px';
        tooltipRef.current.style.top = point.y + 15 + 'px';
        tooltipRef.current.style.display = 'block';
      }
    });

    // 节点鼠标移出
    graphRef.current.on('node:mouseleave', (evt: any) => {
      const node = evt.item;
      graphRef.current.setItemState(node, 'hover', false);
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    });

    // 节点点击（展开/折叠）
    graphRef.current.on('node:click', (evt: any) => {
      const node = evt.item;
      const model = node.getModel();

      if (model.children && model.children.length > 0) {
        const collapsed = !model.collapsed;
        graphRef.current.updateItem(node, { collapsed });

        // 添加动画效果
        const icon = node.getContainer().find((ele: any) => ele.get('name') === 'expand-text');
        if (icon) {
          icon.attr('text', collapsed ? '+' : '-');
        }

        // 更新布局
        setTimeout(() => {
          graphRef.current.layout();
          updateStats();
        }, 50);
      }
    });

    // 画布点击
    graphRef.current.on('canvas:click', () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    });
  };

  // 控制函数
  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.getZoom();
      graphRef.current.zoomTo(currentZoom * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.getZoom();
      graphRef.current.zoomTo(currentZoom * 0.8);
    }
  };

  const handleFitView = () => {
    if (graphRef.current) {
      graphRef.current.fitView();
    }
  };

  const handleExport = () => {
    if (graphRef.current) {
      graphRef.current.downloadFullImage('组织架构图', 'image/png', {
        backgroundColor: '#fff',
        padding: [20, 20, 20, 20],
      });
    }
  };

  const handleExpandAll = () => {
    if (graphRef.current) {
      const nodes = graphRef.current.getNodes();
      nodes.forEach((node: any) => {
        const model = node.getModel();
        if (model.children && model.children.length > 0) {
          graphRef.current.updateItem(node, { collapsed: false });
        }
      });
      setTimeout(() => {
        graphRef.current.layout();
        updateStats();
      }, 100);
    }
  };

  const handleCollapseAll = () => {
    if (graphRef.current) {
      const nodes = graphRef.current.getNodes();
      nodes.forEach((node: any) => {
        const model = node.getModel();
        if (model.children && model.children.length > 0 && model.level >= 1) {
          graphRef.current.updateItem(node, { collapsed: true });
        }
      });
      setTimeout(() => {
        graphRef.current.layout();
        updateStats();
      }, 100);
    }
  };

  const handleResetView = () => {
    if (graphRef.current) {
      graphRef.current.fitView();
      graphRef.current.zoomTo(1);
    }
  };

  const handleSearch = () => {
    if (!graphRef.current || !searchKeyword.trim()) return;

    const keyword = searchKeyword.trim().toLowerCase();
    const nodes = graphRef.current.getNodes();

    // 先清除所有高亮
    nodes.forEach((node: any) => {
      graphRef.current.clearItemStates(node, ['highlight', 'found']);
    });

    // 搜索匹配的节点
    const matchedNodes = nodes.filter((node: any) => {
      const model = node.getModel();
      const nameStr = Array.isArray(model.name)
        ? model.name.map((n: any) => n.name).join(' ')
        : (model.name || '');

      return nameStr.toLowerCase().includes(keyword);
    });

    // 高亮匹配的节点
    matchedNodes.forEach((node: any) => {
      graphRef.current.setItemState(node, 'highlight', true);
      graphRef.current.setItemState(node, 'found', true);

      // 展开父节点以便显示
      let parent = node;
      while (parent) {
        graphRef.current.updateItem(parent, { collapsed: false });
        parent = parent.get('parent');
      }
    });

    // 重新布局
    setTimeout(() => {
      graphRef.current.layout();

      // 如果找到匹配节点，居中显示第一个
      if (matchedNodes.length > 0) {
        graphRef.current.focusItem(matchedNodes[0], true, {
          easing: 'easeCubic',
          duration: 1000,
        });
      }
    }, 300);
  };

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (graphRef.current && containerRef.current) {
        const container = containerRef.current;
        graphRef.current.changeSize(container.clientWidth, container.clientHeight);
        graphRef.current.fitView();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 初始适应视图
  useEffect(() => {
    if (graphRef.current) {
      setTimeout(() => {
        graphRef.current.fitView();
      }, 100);
    }
  }, [graphRef.current]);

  return (
    <div className="container">
      <div className="header">
        <h1>公司组织架构图</h1>
        <p>基于 AntV G6 构建 - 支持拖拽、缩放、搜索等功能</p>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
            placeholder="搜索部门或人员..."
          />
          <button id="search-btn" className="btn" onClick={handleSearch}>
            <i className="fas fa-search"></i> 搜索
          </button>
        </div>
        <div className="stats">
          <div className="stat-item">
            <i className="fas fa-sitemap"></i>
            <span id="node-count">节点: {stats.nodeCount}</span>
          </div>
          <div className="stat-item">
            <i className="fas fa-project-diagram"></i>
            <span id="edge-count">连接: {stats.edgeCount}</span>
          </div>
          <div className="stat-item">
            <i className="fas fa-layer-group"></i>
            <span id="level-count">层级: {stats.levelCount}</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div id="org-chart" ref={containerRef} style={{ width: '100%', height: '800px' }}></div>
      </div>

      <div className="controls">
        <button id="zoom-in" className="btn" onClick={handleZoomIn}>
          <i className="fas fa-search-plus"></i> 放大
        </button>
        <button id="zoom-out" className="btn" onClick={handleZoomOut}>
          <i className="fas fa-search-minus"></i> 缩小
        </button>
        <button id="fit-view" className="btn" onClick={handleFitView}>
          <i className="fas fa-expand-alt"></i> 适应屏幕
        </button>
        <button id="export-btn" className="btn btn-export" onClick={handleExport}>
          <i className="fas fa-download"></i> 导出图片
        </button>
        <button id="expand-all" className="btn btn-expand" onClick={handleExpandAll}>
          <i className="fas fa-expand"></i> 展开全部
        </button>
        <button id="collapse-all" className="btn" onClick={handleCollapseAll}>
          <i className="fas fa-compress"></i> 折叠全部
        </button>
        <button id="reset-view" className="btn btn-reset" onClick={handleResetView}>
          <i className="fas fa-redo"></i> 重置视图
        </button>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#3949f7' }}></div>
          <span>公司总部</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#2b2f8f' }}></div>
          <span>一级部门</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#1a1d5a' }}></div>
          <span>二级部门</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#FC6221' }}></div>
          <span>特殊标签</span>
        </div>
      </div>

      <div className="footer">
        <p>© 2024 公司组织架构图 | 使用 AntV G6 构建 | 数据实时更新</p>
      </div>

      {/* 自定义 tooltip */}
      <div id="custom-tooltip" ref={tooltipRef} className="tooltip"></div>
    </div>
  );
};

export default OrgChart;
