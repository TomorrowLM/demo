/**
 * js抛物线动画
 * @param  {[object]} origin [起点元素]
 * @param  {[object]} target [目标点元素]
 * @param  {[object]} element [要运动的元素]
 * @param  {[number]} a [抛物线弧度]
 * @param  {[number]} time [动画执行时间]
 * @param  {[function]} callback [抛物线执行完成后回调]
 */
class Parabola {
  constructor(config) {
    this.$ = selector => {
      return document.querySelector(selector);
    };
    this.b = 0;
    this.INTERVAL = 10;
    this.timer = null;
    this.config = config || {};
		// 起点
    this.origin = this.$(this.config.origin) || null;
    // 终点
    this.target = this.$(this.config.target) || null;
    // 运动的元素
    this.element = this.$(this.config.element) || null;
    // 曲线弧度
    this.radian = this.config.radian || 0.004;
    // 运动时间(ms)
    this.time = this.config.time || 1000;
    this.originX = this.origin.getBoundingClientRect().left;
    this.originY = this.origin.getBoundingClientRect().top;
    this.originW = this.origin.getBoundingClientRect().width;
    this.targetX = this.target.getBoundingClientRect().left;
    this.targetY = this.target.getBoundingClientRect().top;

    this.elementW = this.element.getBoundingClientRect().width;

    this.diffx = this.targetX - this.originX;
    this.diffy = this.targetY - this.originY;
    this.speedx = this.diffx / this.time;

    // 已知a, 根据抛物线函数 y = a*x*x + b*x + c 将抛物线起点平移到坐标原点[0, 0]，终点随之平移，那么抛物线经过原点[0, 0] 得出c = 0;
    // 终点平移后得出：y2-y1 = a*(x2 - x1)*(x2 - x1) + b*(x2 - x1)
    // 即 diffy = a*diffx*diffx + b*diffx;
    // 可求出常数b的值
    this.b = (this.diffy - this.radian * this.diffx * this.diffx) / this.diffx;
    this.element.style.left = `${this.originX + (this.originW / 2 - 15)}px`;
    this.element.style.top = `${this.originY}px`;
  }

  move() {
		const moveStyleFun = () => {
			let moveS = 'position';
			const testDiv = document.createElement('input');
			if ('placeholder' in testDiv) {
				['', 'ms', 'moz', 'webkit'].forEach((pre) => {
					const transform = `${pre + (pre ? 'T' : 't')  }ransform`;
					if (transform in testDiv.style) {
						moveS = transform;
					}
				});
			}
			return moveS;
		}
    const start = new Date().getTime();
    const moveStyle = moveStyleFun();
    const that = this;

    if (this.timer) return;
    this.element.style.display = 'block';
    this.element.style.left = `${this.originX + (this.originW / 2 - 15)}px`;
    this.element.style.top = `${this.originY}px`;
    this.element.style[moveStyle] = 'translate(0px,0px)';
    this.timer = setInterval(() => {
			if (new Date().getTime() - start > that.time) {
				that.element.style.left = `${that.targetX}px`;
				that.element.style.top = `${that.targetY}px`;
				if (typeof that.config.callback === 'function') {
					that.config.callback();
				}
				clearInterval(that.timer);
        that.timer = null;
        this.element.style.display = 'none';
				return;
			}
			const x = that.speedx * (new Date().getTime() - start);
			const y = that.radian * x * x + that.b * x;
			if (moveStyle === 'position') {
				that.element.style.left = `${x + that.originX}px`;
				that.element.style.top = `${y + that.originY}px`;
			} else if (window.requestAnimationFrame) {
				window.requestAnimationFrame(() => {
						that.element.style[moveStyle] = `translate(${  x  }px,${  y  }px)`;
					});
				} else {
					that.element.style[moveStyle] = `translate(${  x  }px,${  y  }px)`;
				}
    }, this.INTERVAL);
  }
}

export default Parabola;