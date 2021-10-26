let callbacks = []; // 放一个数组放置回调函数

function loadedTinymce() { // 检测脚本是否加载好的方法 如果tinymce加载好了，window对象上会有tinymce属性  若要加载其它脚本只需要将此判断改一下即可
  return window.tinymce
}

const dynamicLoadScript = (src, callback) => {
  const existingScript = document.getElementById(src);
  const cb = callback || function() {};

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = src
    script.id = src
    script.type = 'text/javascript'
    document.body.appendChild(script)
    callbacks.push(cb);
    const onEnd = 'onload' in script ? stdOnEnd : ieOnEnd;
    onEnd(script)
  }

  if (existingScript && cb) {
    if (loadedTinymce()) {
      cb(null, existingScript);
    } else {
      callbacks.push(cb);
    }
  }

  function stdOnEnd(script) { // 标准浏览器加载好脚本后
    script.onload = function() { // 脚本加载成功后
      this.onerror = this.onload = null; //将 script标签的onload和onerror属性置空
      for (const cb of callbacks) { // 执行回调函数 之所以用数组放置回调函数是应对 我仍然事件的发生
        cb(null, script)
      }
      callbacks = null; // 将callbacks置空
    }
    script.onerror = function() { // 脚本加载失败后
      this.onerror = this.onload = null; // 将script标签的onload和onerror置空  覆盖原生的onload事件和nerror事件
      cb(new Error('Failed to load ' + src), script); // 脚本加载错误后执行回调函数，返回报错信息
    }
  }

  function ieOnEnd(script) { // 若是ie浏览器  
    script.onreadystatechange = function() { // 脚本加载成功后
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return; // 脚本没加载好则不执行回调函数 ie浏览器会自动报错
      this.onreadystatechange = null; //若 加载成功
      for (const cb of callbacks) { // 执行回调函数
        cb(null, script)
      }
      callbacks = null; // 置空callbacks
    }
  }
}

export default dynamicLoadScript; // 暴露出动态加载脚本的方法