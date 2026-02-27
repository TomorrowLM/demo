import React, { useEffect, useState, useMemo } from 'react'

function TimerBug() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 闭包捕获了初始的 count（0），因此每次都会 setCount(0 + 1) -> 1
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
    // 依赖为空，effect 只运行一次，造成闭包问题
  }, [])

  return (
    <div style={{ marginBottom: 12 }}>
      <strong>TimerBug</strong>: {count}
    </div>
  )
}

function TimerFix() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 使用函数式更新，避免闭包捕获旧值
    const id = setInterval(() => {
      setCount((c) => c + 1); // 这里的形参 c 是最新的 count 值
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ marginBottom: 12 }}>
      <strong>TimerFix</strong>: {count}
    </div>
  )
}

function UseMemoBug() {
  const [count, setCount] = useState(0)
  // useMemo 没有依赖，返回的函数闭包会捕获创建时的 count
  const memoAlert = useMemo(() => {
    return () => alert(`memo captured count: ${count}`)
  }, [])

  return (
    <div style={{ marginBottom: 12 }}>
      <strong>UseMemoBug</strong>: count={count}{' '}
      <button onClick={() => setCount((c) => c + 1)} style={{ marginLeft: 8 }}>inc</button>
      <button onClick={memoAlert} style={{ marginLeft: 8 }}>memo alert</button>
      <div style={{ color: '#999', marginTop: 6 }}>说明：每次点击 memo alert 会弹出最初捕获的 count（闭包旧值）</div>
    </div>
  )
}

function UseMemoFix() {
  const [count, setCount] = useState(0)
  // 将 count 加入依赖，或使用 useCallback
  const memoAlert = useMemo(() => {
    return () => alert(`memo captured count: ${count}`)
  }, [count])

  return (
    <div style={{ marginBottom: 12 }}>
      <strong>UseMemoFix</strong>: count={count}{' '}
      <button onClick={() => setCount((c) => c + 1)} style={{ marginLeft: 8 }}>inc</button>
      <button onClick={memoAlert} style={{ marginLeft: 8 }}>memo alert</button>
      <div style={{ color: '#999', marginTop: 6 }}>说明：依赖包含 count，memo 每次更新会捕获最新值</div>
    </div>
  )
}

function CounterBug() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1); // 依赖于当前渲染的 count
  };

  const handleAlert = () => {
    setTimeout(() => {
      alert('Current count: ' + count); // 🚨 陷阱所在！捕获的是定义时的 count
    }, 3000);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={handleAlert}>Show Alert (in 3s)</button>
      <div style={{ color: '#999', marginTop: 6 }}>说明：立即点击 “Show Alert” 按钮，并点击“Increment” 按钮 3 次</div>
    </div>
  );
}

function CounterFix() { 
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount((c) => c + 1); // 使用函数式更新，确保拿到最新值
  };

  const handleAlert = () => {
    setTimeout(() => {
      alert('Current count: ' + count); // 现在可以正确显示最新的 count 值了！
    }, 3000);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={handleAlert}>Show Alert (in 3s)</button>
      <div style={{ color: '#999', marginTop: 6 }}>说明：立即点击 “Show Alert” 按钮，并点击“Increment” 按钮 3 次</div>
    </div>
  );
}

function Counter1() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1); // 依赖于当前渲染的 count
  };

  const handleAlert = () => {
    (() => {
      new Promise((resolve) => {
        resolve(1)
          ; // 🚨 陷阱所在！捕获的是定义时的 count
      }).then(() => {
        alert('Current count: ' + count)
      });
    })()
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={handleAlert}>Show Alert (in 3s)</button>
      <div style={{ color: '#999', marginTop: 6 }}>说明：立即点击 “Show Alert” 按钮，并点击“Increment” 按钮 3 次</div>
    </div>
  );
}

function TheoryExplanation() {
  return (
    <div style={{ 
      backgroundColor: '#f0f8ff', 
      border: '2px solid #4169e1', 
      borderRadius: 8, 
      padding: 16, 
      margin: '20px 0' 
    }}>
      <h3 style={{ color: '#4169e1', marginTop: 0 }}>📘 闭包陷阱三大要素</h3>
      
      <div style={{ marginBottom: 12 }}>
        <h4>1️⃣ 嵌套函数结构（闭包基础）</h4>
        <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
          <li>组件内部有定时器、setTimeout、事件回调、Promise 回调等</li>
          <li>这些内部函数引用了组件状态/变量</li>
          <li><strong>✅ 示例：</strong> setTimeout(() => alert(count), 3000)</li>
        </ul>
      </div>

      <div style={{ marginBottom: 12 }}>
        <h4>2️⃣ 依赖固化（核心触发条件）</h4>
        <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
          <li>useEffect、useCallback 等钩子使用空依赖数组 <code>[]</code></li>
          <li>或使用不完整的依赖数组</li>
          <li><strong>❌ 问题：</strong> 钩子只执行一次，内部闭包捕获的状态永远停留</li>
          <li><strong>✅ 修复：</strong> 使用函数式更新或正确依赖</li>
        </ul>
      </div>

      <div style={{ marginBottom: 12 }}>
        <h4>3️⃣ 词法作用域与重渲染叠加</h4>
        <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
          <li>组件重渲染会创建新作用域</li>
          <li>但闭包只认「创建时的作用域」</li>
          <li>不会自动切换到新作用域，导致状态不一致</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#fffacd', 
        borderLeft: '4px solid #ffd700', 
        padding: '12px',
        marginTop: 12
      }}>
        <strong>💡 关键洞察：</strong>
        <p>Promise.then() 回调通常能获取最新值，因为它作为微任务在当前渲染周期内执行，而 setTimeout 等宏任务会在后续事件循环中执行，更容易捕获过期的闭包状态。</p>
      </div>
    </div>
  );
}

export default function ClosureDemo(): JSX.Element {
  return (
    <div style={{ padding: 16 }}>
      <TheoryExplanation />
      <h3>React 闭包（closure）示例</h3>
      <h4 style={{ marginBottom: 8 }}>
        计时器（useEffect）
      </h4>
      <TimerBug />
      <TimerFix />
      
      <h4 style={{ marginBottom: 8 }}>
        useMemo
      </h4>
      <UseMemoBug />
      <UseMemoFix />
      
      <h4 style={{ marginBottom: 8 }}>
        计时器setTimeout
      </h4>
      <Counter1></Counter1>
      {/* <Counter2></Counter2> */}
    </div>
  )
}

