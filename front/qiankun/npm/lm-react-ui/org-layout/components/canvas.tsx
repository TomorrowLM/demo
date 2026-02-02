import React, { useEffect, useRef } from 'react';

interface TreeNode {
  name: string | Array<{ name: string }>;
  symbolSize?: [number, number];
  bg?: string;
  color?: string;
  tag?: Array<{
    name: string;
    bg?: string;
    color?: string;
  }>;
  children?: TreeNode[];
}

const OrgLayoutCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // 使用共享数据
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: sharedTree } = require('../treeData');
    const treeData: TreeNode = sharedTree;

    // 可配置项
    let align: 'center' | 'left' = 'center';
    const margin = 20; // 画布左右内边距
    const vGap = 160; // 父子垂直间距（增加以提升上下边距）
    const hGap = 30; // 同级横向间距
    const rootTop = 80; // 根距离顶部距离（增大以给顶部更多空白）
    let viewScale = 1; // 视图缩放（用于自适应宽度）
    let viewOffsetX = 0; // 视图平移（屏幕像素）
    let viewOffsetY = 0;
    const minScale = 0.3;
    const maxScale = 2.5;
    // 是否有自动适配请求（首次渲染或点击“自适应宽度”时为 true）
    let autoFitRequested = true;
    // 全局尺寸缩放因子（同时作用于显式的 symbolSize 与默认尺寸）
    const baseScale = 1.6;
    // 拖拽平移状态
    let isDragging = false;
    let dragStartX = 0,
      dragStartY = 0;
    let dragThreshold = 4; // 像素，超过视为拖拽以抑制 click
    let wasDragged = false;
    // 计算子树所需总宽（基于节点宽）
    function computeWidth(node: TreeNode): number {
      // 使用 baseScale 对显式或默认宽度进行放大
      const rawW =
        node.symbolSize && node.symbolSize[0] ? node.symbolSize[0] : 180;
      const w = Math.round(rawW * baseScale);
      if (!node.children || node.children.length === 0) return w;
      const childWidths = node.children.map(computeWidth);
      const totalChildren =
        childWidths.reduce((a, b) => a + b, 0) +
        hGap * (node.children.length - 1);
      return Math.max(w, totalChildren);
    }
    // 简单的 hex 颜色变暗/变亮（percent: -100..100）
    function shadeHexColor(hex: string, percent: number): string {
      try {
        const base = (hex || '').replace('#', '');
        const normalized =
          base.length === 3
            ? base
                .split('')
                .map((c) => c + c)
                .join('')
            : base;
        const num = parseInt(normalized, 16);
        let r = (num >> 16) & 0xff;
        let g = (num >> 8) & 0xff;
        let b = num & 0xff;
        const amt = Math.round(2.55 * percent);
        r = Math.max(0, Math.min(255, r + amt));
        g = Math.max(0, Math.min(255, g + amt));
        b = Math.max(0, Math.min(255, b + amt));
        return (
          '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        );
      } catch (e) {
        return hex;
      }
    }
    // 绘制圆角矩形（以中心为坐标）
    function drawRoundRect(
      cx: number,
      cy: number,
      w: number,
      h: number,
      r: number,
      fillStyle: string,
      strokeStyle?: string,
      strokeWidth = 0,
    ) {
      const x = cx - w / 2;
      const y = cy - h / 2;
      ctx.beginPath();
      const rad = Math.min(r, Math.abs(h / 2), Math.abs(w / 2));
      ctx.moveTo(x + rad, y);
      ctx.arcTo(x + w, y, x + w, y + h, rad);
      ctx.arcTo(x + w, y + h, x, y + h, rad);
      ctx.arcTo(x, y + h, x, y, rad);
      ctx.arcTo(x, y, x + w, y, rad);
      ctx.closePath();
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle && strokeWidth > 0) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
      }
    }
    // 布局：以节点中心坐标为锚点
    function layout(node: TreeNode, x: number, y: number) {
      // 默认宽高从 140x40 -> 180x56，且应用 baseScale
      const rawW =
        node.symbolSize && node.symbolSize[0] ? node.symbolSize[0] : 180;
      const rawH =
        node.symbolSize && node.symbolSize[1] ? node.symbolSize[1] : 56;
      const w = Math.round(rawW * baseScale);
      const h = Math.round(rawH * baseScale);
      (node as any)._x = x;
      (node as any)._y = y;
      (node as any)._w = w;
      (node as any)._h = h;

      if (!node.children || node.children.length === 0) return;
      const childWidths = node.children.map(computeWidth);
      const totalW =
        childWidths.reduce((a, b) => a + b, 0) +
        hGap * (node.children.length - 1);
      let startX = x - totalW / 2;
      for (let i = 0; i < node.children.length; i++) {
        const cw = childWidths[i];
        const childCenterX = startX + cw / 2;
        const childRawH =
          node.children[i].symbolSize && node.children[i].symbolSize[1]
            ? node.children[i].symbolSize[1]
            : 56;
        const childH = Math.round(childRawH * baseScale);
        const childY = y + h / 2 + vGap + childH / 2;
        layout(node.children[i], childCenterX, childY);
        startX += cw + hGap;
      }
    }
    function drawNode(node: TreeNode) {
      const x = (node as any)._x;
      const y = (node as any)._y;
      const w = (node as any)._w;
      const h = (node as any)._h;
      const r = Math.min(24, h / 2, w / 4);
      drawRoundRect(x, y, w, h, r, node.bg || '#eef2ff');
      // 渲染 tag（如果存在），放在节点内部右侧；为避免覆盖，把节点文字改为左对齐显示
      ctx.fillStyle = node.color || '#2b2f8f';
      const fontSize =
        (node as any).label && (node as any).label.fontSize
          ? Math.round((node as any).label.fontSize * baseScale)
          : w > 160
          ? 32
          : 22;
      ctx.font = fontSize + 'px sans-serif';
      ctx.textBaseline = 'middle';

      let totalTagsW = 0;
      let tagWidths: number[] = [];
      if (node.tag && Array.isArray(node.tag) && node.tag.length) {
        const tagFontSize = Math.round(12 * baseScale);
        const tagHPadding = Math.round(8 * baseScale);
        const tagSpacing = Math.round(8 * baseScale);
        ctx.font = tagFontSize + 'px sans-serif';
        tagWidths = node.tag.map((t) => {
          const txt = t && t.name ? t.name.toString() : '';
          const m = ctx.measureText(txt);
          return Math.ceil(m.width) + tagHPadding * 2;
        });
        totalTagsW =
          tagWidths.reduce((a, b) => a + b, 0) +
          tagSpacing * (tagWidths.length - 1);
        // 计算起始位置：让标签块紧贴节点右内边距
        const innerPadding = Math.round(8 * baseScale);
        let startLeft = x + w / 2 - innerPadding - totalTagsW; // left edge of tag block
        const tagY = y;
        // 绘制每个 tag（从左到右）
        for (let i = 0; i < node.tag.length; i++) {
          const t = node.tag[i];
          const tw = tagWidths[i];
          const tx = startLeft + tw / 2;
          const rawBg = t && t.bg ? t.bg : '#f1f5ff';
          const color = t && t.color ? t.color : '#2b2f8f';
          // 如果 tag 背景与节点背景一致，使用稍微深一点的回退色以便可见
          const bg =
            rawBg && node.bg && rawBg.toLowerCase() === node.bg.toLowerCase()
              ? shadeHexColor(rawBg, -12)
              : rawBg;
          const br = Math.round(12 * baseScale);
          const tagH =
            Math.round(12 * baseScale) + Math.round(4 * baseScale) * 2;
          // 使用 save/restore 隔离样式，保证颜色正确应用
          ctx.save();
          // 绘制背景
          ctx.fillStyle = bg;
          drawRoundRect(tx, tagY, tw, tagH, br, bg);
          // 绘制文字
          ctx.fillStyle = color;
          ctx.font = Math.round(12 * baseScale) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t && t.name ? t.name : '', tx, tagY);
          ctx.restore();
          startLeft += tw + Math.round(8 * baseScale);
        }
      }

      // 绘制节点文字：当没有 tag 时文字默认居中；有 tag 时左对齐并留出 tag 区域
      const textInnerPad = Math.round(12 * baseScale);
      ctx.font = fontSize + 'px sans-serif';
      ctx.textBaseline = 'middle';
      let availableW, textX;
      if (totalTagsW && totalTagsW > 0) {
        // 有 tag：左对齐，留出 tag 宽度
        availableW = w - totalTagsW - textInnerPad - Math.round(8 * baseScale);
        ctx.textAlign = 'left';
        textX = x - w / 2 + textInnerPad;
      } else {
        // 无 tag：文字居中显示
        availableW = w - textInnerPad * 2;
        ctx.textAlign = 'center';
        textX = x;
      }
      ctx.fillStyle = node.color || '#2b2f8f';
      // 支持 name 为数组时多行展示
      let lines: string[] = [];
      if (Array.isArray(node.name)) {
        lines = node.name.map((item) =>
          typeof item === 'object' && item !== null
            ? item.name || ''
            : item + '',
        );
      } else {
        lines = [(node.name as string) || ''];
      }
      // 每行高度
      const lineHeight = Math.round(fontSize * 1.18);
      // 计算整体高度，垂直居中
      const totalH = lines.length * lineHeight;
      let startY = y - totalH / 2 + lineHeight / 2;
      for (let i = 0; i < lines.length; i++) {
        let text = lines[i];
        // 截断
        if (ctx.measureText(text).width > availableW) {
          while (
            text.length > 0 &&
            ctx.measureText(text + '...').width > availableW
          )
            text = text.slice(0, -1);
          text = text + '...';
        }
        ctx.fillText(text, textX, startY + i * lineHeight);
      }
    }
    // 画折线连接：垂直 -> 水平 -> 垂直（使用 round lineJoin 与 lineCap 实现圆角）
    function drawConnector(
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      color = '#3949f7',
      width = 6,
    ) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const forkY = fromY + Math.max(12, (toY - fromY) * 0.35);
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(fromX, forkY);
      ctx.lineTo(toX, forkY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      ctx.restore();
    }

    // 递归绘制所有连接线
    function drawConnectors(node: TreeNode) {
      if (!node.children || node.children.length === 0) return;
      for (const ch of node.children) {
        const fromX = (node as any)._x;
        const fromY = (node as any)._y + (node as any)._h / 2;
        const toX = (ch as any)._x;
        const toY = (ch as any)._y - (ch as any)._h / 2;
        drawConnector(fromX, fromY, toX, toY, '#3949f7', 6);
        drawConnectors(ch);
      }
    }
    function drawAll() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const canvasW = canvas.clientWidth;
      const treeW = computeWidth(treeData);

      // 计算视图缩放，使树在可用宽度内显示
      const availableW = Math.max(20, canvasW - margin * 2);
      // 计算自动缩放比例（仅在首次加载或用户点击“自适应宽度”时应用）
      const autoScale = treeW > 0 ? Math.min(1, availableW / treeW) : 1;
      if (autoFitRequested) {
        viewScale = autoScale;
        autoFitRequested = false;
      }

      // 计算根节点在逻辑坐标系中的位置
      let rootX: number;
      if (align === 'center') {
        rootX = canvasW / 2 / viewScale;
      } else {
        rootX =
          (margin +
            (treeData.symbolSize && treeData.symbolSize[0]
              ? treeData.symbolSize[0] / 2
              : 140) /
              2 +
            10) /
          viewScale;
      }
      const rootY =
        (rootTop +
          (treeData.symbolSize && treeData.symbolSize[1]
            ? treeData.symbolSize[1] / 2
            : 40)) /
        viewScale;

      // 布局使用逻辑坐标（未缩放）
      layout(treeData, rootX, rootY);

      // 在绘制时应用缩放（DPR 变换已在 resize/init 中设置）
      ctx.save();
      ctx.translate(viewOffsetX, viewOffsetY);
      ctx.scale(viewScale, viewScale);
      drawConnectors(treeData);
      (function drawNodesRec(n: TreeNode) {
        drawNode(n);
        if (n.children) {
          for (const c of n.children) {
            drawNodesRec(c);
          }
        }
      })(treeData);
      ctx.restore();
    }
    function draw() {
      drawAll();
    }

    function fitToWidth() {
      // 标记为自动适配请求，下一次绘制时会根据可用宽度设置 viewScale
      autoFitRequested = true;
      draw();
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function init() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    // 鼠标滚轮缩放（以光标为中心）
    const handleWheel = function (e: WheelEvent) {
      e.preventDefault();
      // 如果是首次自适应，先触发一次 draw 让内容居中，再继续缩放
      // if (autoFitRequested) {
      //   autoFitRequested = false;
      //   draw();
      // }
      console.log('handleWheel', e);
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      // 当前鼠标对应的逻辑坐标（未缩放/未偏移）
      const logicalX = (mouseX - viewOffsetX) / viewScale;
      const logicalY = (mouseY - viewOffsetY) / viewScale;
      // 缩放比例（指数方便平滑）
      const delta = -e.deltaY;
      const factor = Math.exp(delta * 0.0015);
      let newScale = viewScale * factor;
      newScale = Math.max(minScale, Math.min(maxScale, newScale));
      // 直接根据新的 scale 和之前计算的逻辑点，计算出新的 viewOffset，保证鼠标下的逻辑点保持在同一屏幕位置
      viewScale = newScale;
      viewOffsetX = mouseX - logicalX * viewScale;
      viewOffsetY = mouseY - logicalY * viewScale;
      draw();
    };

    // 鼠标拖拽平移
    const handleMouseDown = function (e: MouseEvent) {
      if (e.button !== 0) return; // 仅左键
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      wasDragged = false;
      canvas.style.cursor = 'grabbing';
      e.preventDefault();
    };

    // 鼠标移动
    const handleMouseMove = function (e: MouseEvent) {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (
        !wasDragged &&
        (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)
      ) {
        wasDragged = true;
      }
      // 更新视图偏移（屏幕像素）
      viewOffsetX += dx;
      viewOffsetY += dy;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      draw();
      e.preventDefault();
    };

    // 鼠标松开
    const handleMouseUp = function () {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = 'default';
      }
    };

    // 触控拖拽支持（移动设备）
    const handleTouchStart = function (e: TouchEvent) {
      if (!e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      isDragging = true;
      wasDragged = false;
      dragStartX = t.clientX;
      dragStartY = t.clientY;
    };

    // 触控移动 支持（移动设备）
    const handleTouchMove = function (e: TouchEvent) {
      if (!isDragging || !e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - dragStartX;
      const dy = t.clientY - dragStartY;
      if (
        !wasDragged &&
        (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)
      ) {
        wasDragged = true;
      }
      viewOffsetX += dx;
      viewOffsetY += dy;
      dragStartX = t.clientX;
      dragStartY = t.clientY;
      draw();
      e.preventDefault();
    };

    const handleTouchEnd = function () {
      isDragging = false;
    };

    // 点击节点交互（将屏幕坐标转换为逻辑坐标以命中测试）
    const handleClick = function (e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const x = (sx - viewOffsetX) / viewScale;
      const y = (sy - viewOffsetY) / viewScale;
      let hit: TreeNode | null = null;

      function hitTest(n: TreeNode) {
        const nx = (n as any)._x;
        const ny = (n as any)._y;
        const w = (n as any)._w;
        const h = (n as any)._h;
        if (
          x >= nx - w / 2 &&
          x <= nx + w / 2 &&
          y >= ny - h / 2 &&
          y <= ny + h / 2
        ) {
          hit = n;
        }
        if (n.children) {
          for (const c of n.children) {
            hitTest(c);
          }
        }
      }

      hitTest(treeData);
      if (hit) {
        const node = hit as TreeNode;
        alert('节点：' + JSON.stringify(node.name));
      }
    };

    // 添加事件监听器
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    canvas.addEventListener('click', handleClick);

    // 初始化
    init();

    // 按钮事件监听（使用命名处理器以便正确解绑）
    const toggleAlignBtn = document.getElementById('toggleAlign');
    const fitBtn = document.getElementById('fit');
    const handleToggleAlignBtn = () => {
      align = align === 'left' ? 'center' : 'left';
      draw();
    };
    const handleFitBtn = () => {
      fitToWidth();
    };
    if (toggleAlignBtn)
      toggleAlignBtn.addEventListener('click', handleToggleAlignBtn);
    if (fitBtn) fitBtn.addEventListener('click', handleFitBtn);

    // 清理函数
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('click', handleClick);

      if (toggleAlignBtn)
        toggleAlignBtn.removeEventListener('click', handleToggleAlignBtn);
      if (fitBtn) fitBtn.removeEventListener('click', handleFitBtn);
    };
  }, []);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div
        id="toolbar"
        style={{ position: 'absolute', right: '12px', top: '12px', zIndex: 10 }}
      >
        <button
          type="button"
          id="toggleAlign"
          style={{ marginLeft: '8px', padding: '6px 10px', fontSize: '13px' }}
        >
          切换居中 / 靠左
        </button>
        <button
          type="button"
          id="fit"
          style={{ marginLeft: '8px', padding: '6px 10px', fontSize: '13px' }}
        >
          自适应宽度
        </button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: '#fff',
        }}
      />
    </div>
  );
};

export default OrgLayoutCanvas;
