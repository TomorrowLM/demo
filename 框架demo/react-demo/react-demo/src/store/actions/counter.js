/**
 * action:数据更新的指令，它会告诉reduce如何去处理数据
 */
export const increment = () => {
  return { type: "INCREMENT" };
};
export const decrement = () => {
  return { type: "DECREMENT" };
};
