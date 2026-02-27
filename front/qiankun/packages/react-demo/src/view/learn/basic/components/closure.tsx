import React, { useEffect, useState, useMemo, useRef } from 'react'
import LmCard from '@/components/Lm-card'
import request from "@/utils/request";
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
          <li><strong>✅ 示例：</strong> setTimeout(() =&gt; alert(count), 3000)</li>
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

// 异步回调（Promise + setTimeout）导致的闭包问题
function AsyncCallbackBug() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // React 只是记录一条“把 count 从 X 改成 X+1”的更新，暂时不立刻重渲染组件
    console.log('Click count:', count); // 🚨 问题：此处显示的 count 是闭包捕获的旧值，是批处理
  };

  const handleAsync = () => {
    // 模拟一个 3 秒后才返回结果的异步请求
    request
      .get("/common/setTimeOut",)
      .then((res) => {
        // 🚨 问题：then 回调闭包里捕获的是调用 handleAsync 时的 count
        alert('Async callback count (BUG): ' + count);
      })
      .catch((err) => {
        console.log("login error", err);
      });
  };

  return (
    <div style={{ marginTop: 12 }}>
      <p>AsyncCallbackBug Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={handleAsync} style={{ marginLeft: 8 }}>Async Request</button>
      <div style={{ color: '#999', marginTop: 6 }}>说明：先点 Async Request，再在 3 秒内多次点击 Increment，弹框会显示旧的 count。</div>
    </div>
  );
}

function AsyncCallbackFix() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 同步最新的 count 到 ref
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  const handleAsync = () => {
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
    }).then(() => {
      // ✅ 修复：回调中通过 ref 读取最新的 count
      alert('Async callback count (FIX): ' + countRef.current);
    });
  };

  return (
    <div style={{ marginTop: 12 }}>
      <p>AsyncCallbackFix Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={handleAsync} style={{ marginLeft: 8 }}>Async Request</button>
      <div style={{ color: '#999', marginTop: 6 }}>说明：使用 ref 保证异步回调总是读到最新的 count。</div>
    </div>
  );
}

export default function ClosureDemo(): JSX.Element {
  return (
    <div style={{ padding: 16 }}>
      <LmCard
        type="theory"
        title="闭包说明"
        bordered={false}
        style={{ marginBottom: 16 }}
        collapsible
      >
        <TheoryExplanation />
      </LmCard>

      <LmCard
        type="demo"
        title="示例 Demo"
        bordered={false}
        collapsible
      >
        <h3 style={{ marginBottom: 8 }}>
          计时器（useEffect）
        </h3>
        <TimerBug />
        <TimerFix />

        <h4 style={{ marginBottom: 8 }}>
          useMemo
        </h4>
        <UseMemoBug />
        <UseMemoFix />
        <h4 style={{ marginBottom: 8 }}>
          异步回调（Promise + setTimeout）
        </h4>
        <AsyncCallbackBug></AsyncCallbackBug>
        <AsyncCallbackFix></AsyncCallbackFix>
      </LmCard>
    </div>
  )
}

