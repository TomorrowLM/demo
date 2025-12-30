import { applyQiankunPublicPath } from './qiankun/public-path.js';
import { log } from "./log.js"

export function AppInit() {
  applyQiankunPublicPath();
  log();
};