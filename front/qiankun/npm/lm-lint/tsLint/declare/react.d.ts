// import './common.d.ts';
export * from './common';

declare global {
  declare module '*.module.less' {
    const classes: { [key: string]: string };
    export default classes;
  }
}