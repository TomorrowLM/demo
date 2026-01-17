import React from 'react';
import ReactDOM from 'react-dom/client';
import OrgChart from './OrgChart';
import './style.css';

// 添加字体图标
const addFontAwesome = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
  document.head.appendChild(link);
};

addFontAwesome();

const App: React.FC = () => {
  return (
    <div>
      <OrgChart />
    </div>
  );
};

// 渲染应用
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

export default App;
