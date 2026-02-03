// src/view/grammer/index.tsx
import React, { useState, useEffect, lazy, Suspense } from "react";
// import UseState from './index.jsx';

interface ClassHooksState {
  count: number;
}

class ClassCom extends React.Component<{}, ClassHooksState> {
  constructor(props: {}) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return <>
      {/* <UseState></UseState> */}
    </>;
  }
}

// const MyComponent = lazy(() => {
//   const module = import('./UseState');
//   module.then((mod) => {
//     console.log('Module loaded:', mod); // 调试信息
//   });
//   return module;
// });

// const App: React.FC = () => {
//   return (
//     <div>
//       <ClassHooks />
//       <Suspense fallback={<div>Loading...</div>}>
//         <MyComponent />
//       </Suspense>
//     </div>
//   );
// };

export default ClassCom;