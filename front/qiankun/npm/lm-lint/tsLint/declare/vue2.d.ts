import './common.d.ts';
export { };

declare global {
  declare module '@/*' {
    const content: any;
    export default content;
  }
}
