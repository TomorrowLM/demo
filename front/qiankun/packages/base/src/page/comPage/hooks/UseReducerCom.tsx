import React, { useReducer } from 'react';
import { Button } from 'antd';
interface State {
  count: number;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

const UseReducerCom: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <h2>计数器: {state.count}</h2>
      <Button onClick={() => dispatch({ type: 'increment' })}>+1</Button>
      <Button onClick={() => dispatch({ type: 'decrement' })}>-1</Button>
      <Button onClick={() => dispatch({ type: 'reset' })}>重置</Button>
    </div>
  );
}

export default UseReducerCom
