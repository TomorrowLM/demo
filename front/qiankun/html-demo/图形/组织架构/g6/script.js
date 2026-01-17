class OrgChart {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.zoomLevel = 1;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  // 渲染组织架构图
  render() {
    this.container.innerHTML = '';
    this.createNode(this.data, 0);
  }

  // 创建节点
  createNode(nodeData, level) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = `org-node level-${level}`;
    nodeDiv.setAttribute('data-level', level);

    // 节点内容
    const contentDiv = document.createElement('div');
    contentDiv.className = 'org-node-content';

    // 多行文本处理
    if (Array.isArray(nodeData.name)) {
      nodeData.name.forEach(item => {
        this.addNameElement(contentDiv, item);
      });
    } else {
      this.addNameElement(contentDiv, { name: nodeData.name, tip: nodeData.tip, tag: nodeData.tag });
    }

    nodeDiv.appendChild(contentDiv);

    // 如果有子节点，添加折叠/展开按钮
    if (nodeData.children && nodeData.children.length > 0) {
      const toggleBtn = document.createElement('div');
      toggleBtn.className = 'toggle-btn';
      toggleBtn.innerHTML = '<i class="fas fa-minus"></i>';
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleChildren(nodeDiv, nodeData);
      });
      contentDiv.appendChild(toggleBtn);

      // 子节点容器
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'node-children';

      nodeData.children.forEach(child => {
        const childNode = this.createNode(child, level + 1);
        childrenDiv.appendChild(childNode);
      });

      nodeDiv.appendChild(childrenDiv);
    }

    // 添加悬浮提示
    if (nodeData.tip) {
      contentDiv.addEventListener('mouseenter', (e) => this.showTooltip(e, nodeData.tip));
      contentDiv.addEventListener('mouseleave', () => this.hideTooltip());
    }

    return nodeDiv;
  }

  // 添加名称元素
  addNameElement(container, item) {
    const nameDiv = document.createElement('div');
    nameDiv.className = 'node-name';

    // 处理长文本 - 自动换行
    const maxLength = 15;
    let displayName = item.name;
    if (item.name.length > maxLength) {
      // 每 maxLength 个字符插入换行
      const parts = [];
      for (let i = 0; i < item.name.length; i += maxLength) {
        parts.push(item.name.substring(i, i + maxLength));
      }
      displayName = parts.join('<br>');
    }

    nameDiv.innerHTML = displayName;
    container.appendChild(nameDiv);

    // 添加标签
    if (item.tag && item.tag.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'node-tags';

      item.tag.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag.name;
        if (tag.color) {
          tagSpan.style.color = tag.color;
          tagSpan.style.borderColor = tag.borderColor || tag.color;
        }
        tagsDiv.appendChild(tagSpan);
      });

      container.appendChild(tagsDiv);
    }
  }

  // 折叠/展开子节点
  toggleChildren(nodeDiv, nodeData) {
    const childrenDiv = nodeDiv.querySelector('.node-children');
    const toggleIcon = nodeDiv.querySelector('.toggle-btn i');

    if (childrenDiv.style.display === 'none') {
      childrenDiv.style.display = 'flex';
      toggleIcon.className = 'fas fa-minus';
    } else {
      childrenDiv.style.display = 'none';
      toggleIcon.className = 'fas fa-plus';
    }
  }

  // 显示提示
  showTooltip(event, tip) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = tip;
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY + 10) + 'px';
    tooltip.classList.add('show');
  }

  // 隐藏提示
  hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('show');
  }

  // 绑定事件
  bindEvents() {
    // 展开/全部按钮
    document.getElementById('toggleAll').addEventListener('click', () => {
      const allChildren = this.container.querySelectorAll('.node-children');
      const isHidden = Array.from(allChildren).some(child => child.style.display === 'none');

      allChildren.forEach(child => {
        child.style.display = isHidden ? 'flex' : 'none';
      });

      const allIcons = this.container.querySelectorAll('.toggle-btn i');
      allIcons.forEach(icon => {
        icon.className = isHidden ? 'fas fa-minus' : 'fas fa-plus';
      });
    });

    // 放大
    document.getElementById('zoomIn').addEventListener('click', () => {
      this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
      this.applyZoom();
    });

    // 缩小
    document.getElementById('zoomOut').addEventListener('click', () => {
      this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
      this.applyZoom();
    });

    // 导出为图片（使用 html2canvas 库）
    document.getElementById('download').addEventListener('click', () => {
      this.exportAsImage();
    });
  }

  // 应用缩放
  applyZoom() {
    this.container.style.transform = `scale(${this.zoomLevel})`;
    this.container.style.transformOrigin = 'top center';
  }

  // 导出为图片
  async exportAsImage() {
    try {
      // 动态加载 html2canvas
      const { default: html2canvas } = await import('https://esm.sh/html2canvas@1.4.1');

      const chart = this.container;
      const canvas = await html2canvas(chart, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = '组织架构图.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      alert('导出失败，请检查网络连接');
      console.error('导出错误:', error);
    }
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  const orgChart = new OrgChart('orgChart', treeData);

  // 保存初始缩放级别
  orgChart.container.style.transition = 'transform 0.3s ease';
});