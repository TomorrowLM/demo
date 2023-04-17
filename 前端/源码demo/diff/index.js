/**
 * 
 * @param {*} tagName 元素标签
 * @param {*} props 
 * @param {*} children 子元素
 * @returns 
 */
function Element(tagName, props, children) {
  //生成构造实例
  if (!(this instanceof Element)) {
    return new Element(tagName, props, children)
  }
  this.tagName = tagName
  this.props = props || {}
  console.log(typeof children);

  this.children = children || undefined
  this.key = props ? props.key : undefined
  // let count = 0;
  // //子元素是文本节点
  // if (!this.children || typeof this.children === 'string' || typeof this.children === 'number') {
  //   // 创建文本节点
  //   count++;
  // } else {
  //   this.children.forEach((child) => {
  //     if (child instanceof Element) {
  //       count += child.count
  //     }
  //     count++;
  //   })
  // }
  // this.count = count
}

Element.prototype.render = function () {
  const el = document.createElement(this.tagName)
  const props = this.props;
  for (const propName in props) {
    el.setAttribute(propName, props[propName])
  }
  // 子元素是文本节点
  if (typeof this.children === 'string' || typeof this.children === 'number') {
    el.appendChild(document.createTextNode(this.children))
  } else {
    this.children.forEach(child => {
      const childEl = (child instanceof Element) ? child.render() : document.createElement(this.tagName)
      el.appendChild(childEl)
    })
  }
  return el
}

const tree = Element(
  'div', { id: '1' }, 
  [
    Element('p', {}, 'app'),
    Element('div', {}, 'before update'),
    Element('ul', {},
      [
        Element('li', { class: 'item' }, 'item 1'),
        Element('li', { class: 'item' }, 'item 2'),
        Element('li', { class: 'item' }, 'item 3')
      ]
    )
  ]
)

const newTree = Element(
  'div', { id: '1' },
  [
    Element('h1', {}, 'app'),//replace 节点类型变了 直接将旧节点卸载并装载新节点
    Element('div', {}, 'after update'),//text 文本变了 此时不会触发节点卸载和装载，而是节点更新
    Element('ul', { class: 'new' },//props 属性或属性值变了
      [
        Element('li', { class: 'item' }, 'item 1'),//reorder 移动／增加／删除 子节点
        Element('li', { class: 'item' }, 'item 3')
      ]
    )
  ]
)
const root = tree.render();
console.log(root, 'root');
document.getElementById('app').appendChild(root)
console.log(window);
// 第一个参数是节点名（如div），第二个参数是节点的属性（如class），第三个参数是子节点（如ul的li）。除了这三个参数会被保存在对象上外，还保存了key和count。其相当于形成了虚拟DOM树。