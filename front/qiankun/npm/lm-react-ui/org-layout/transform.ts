import { TreeNode, TreeTag } from './types';

interface RoleItem {
  key: string;
  value: string;
}

interface TransformOptions {
  rootSymbolSize?: [number, number];
  childSymbolSize?: [number, number];
  rootBg?: string;
  rootColor?: string;
  nodeBg?: string;
  nodeColor?: string;
  fontSize?: number;
  tagStyle?: { bg: string; color: string; borderColor: string };
}

const defaultOptions: Required<TransformOptions> = {
  rootSymbolSize: [260, 90],
  childSymbolSize: [160, 48],
  rootBg: '#F5FAFF',
  rootColor: '#2b2f8f',
  nodeBg: '#F5FAFF',
  nodeColor: '#2b2f8f',
  fontSize: 14,
  tagStyle: { bg: '#F5FAFF', color: '#FC6221', borderColor: '#FC6221' },
};

function buildTag(
  isManager: boolean,
  opts: Required<TransformOptions>,
): TreeTag[] {
  if (!isManager) return [];
  const { bg, color, borderColor } = opts.tagStyle;
  return [{ name: '部门主管', bg, color, borderColor }];
}

function findRoleName(rylxDm: any, roleMap: RoleItem[]): string {
  const code = rylxDm !== null ? String(rylxDm) : '';
  return roleMap.find((r) => r.key === code)?.value || '';
}

export function dataToTreeData(
  data: any,
  roleMap: RoleItem[],
  options?: TransformOptions,
): TreeNode {
  const opts: Required<TransformOptions> = {
    ...defaultOptions,
    ...options,
  } as any;

  function mapNode(node: any, depth: number): TreeNode {
    const nameEntries: Array<{
      name: string;
      tip?: string;
      tag?: TreeTag[];
      rylxDm?: string;
      fontSize?: number;
    }> = [];
    const nodeName = node?.bmmc || node?.name || '';
    nameEntries.push({ name: String(nodeName || ''), fontSize: 16 });

    const ryList: any[] = Array.isArray(node?.ryList) ? node.ryList : [];
    ryList.forEach((ry) => {
      const tip = findRoleName(ry?.rylxDm, roleMap);
      const isManager = ry?.zw === '部门主管' || ry?.sflx === 10;
      nameEntries.push({
        name: String(ry?.xm || ''),
        tip,
        tag: buildTag(isManager, opts),
        rylxDm: ry?.rylxDm,
        fontSize: 12,
      });
    });

    const children: TreeNode[] = Array.isArray(node?.children)
      ? node.children.map((c: any) => mapNode(c, depth + 1))
      : [];

    const isRoot = depth === 0;
    const symbolSize = isRoot ? opts.rootSymbolSize : opts.childSymbolSize;
    const bg = isRoot ? opts.rootBg : opts.nodeBg;
    const color = isRoot ? opts.rootColor : opts.nodeColor;

    return {
      name: nameEntries,
      symbolSize,
      bg,
      color,
      fontSize: node?.fontSize || opts.fontSize,
      children,
    };
  }

  return mapNode(data, 0);
}
