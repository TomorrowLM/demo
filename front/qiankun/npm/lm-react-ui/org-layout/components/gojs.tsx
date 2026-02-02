import * as go from 'gojs';
import React, { useEffect, useRef } from 'react';
import { TreeNode } from '../types';

function addIds(n: TreeNode, prefix = 'n') {
  if (!n) return;
  if (!n._id) n._id = prefix + Math.random().toString(36).slice(2, 9);
  if (n.children)
    for (let i = 0; i < n.children.length; i++)
      addIds(n.children[i], n._id + '_');
}

function treeToNodesAndLinks(root: TreeNode) {
  addIds(root, 'g_');
  const nodes: any[] = [];
  const links: any[] = [];
  function walk(n: TreeNode, parent?: TreeNode) {
    const id = n._id;
    const baseColor = n.color || '#2b2f8f';
    const fontSize = (n as any).fontSize || 14;
    // build lines so each name entry can carry its own tags
    const makeTags = (arr?: any[]) =>
      (arr || []).map((t: any) => ({
        text: t && t.name ? String(t.name) : '',
        bg: (t && t.bg) || '#F5FAFF',
        color: (t && t.color) || baseColor,
        borderColor: (t && t.borderColor) || '#dfe7ff',
      }));

    let lines: any[] = [];
    if (Array.isArray(n.name)) {
      lines = n.name.map((it: any) => ({
        text: it && it.name ? String(it.name) : '',
        tags: makeTags(it && it.tag),
        tip: it && it.tip ? String(it.tip) : '',
        fontSize,
        color: baseColor,
      }));
    } else {
      lines = [
        {
          text: String(n.name || ''),
          tags: makeTags(n.tag),
          tip: (n as any).tip ? String((n as any).tip) : '',
          fontSize,
          color: baseColor,
        },
      ];
    }
    const size = n.symbolSize || [180, 56];
    // estimate per-line height: text height derives from fontSize, tag chip ~30px; optional tip line ~16px
    const textLineH = Math.round(fontSize * 1.2);
    const tagLineH = 30;
    const tipLineH = 16;
    const lineSpacing = 4; // space between lines
    const paddingY = 16; // top+bottom padding
    const contentH = lines.reduce((sum: number, ln: any, idx: number) => {
      const hasTags = (ln.tags || []).length > 0;
      const hasTip = !!ln.tip;
      const lineH = hasTags ? Math.max(textLineH, tagLineH) : textLineH;
      const tipH = hasTip ? tipLineH : 0;
      const gap = idx === lines.length - 1 ? 0 : lineSpacing;
      return sum + lineH + tipH + gap;
    }, 0);
    const autoHeight = contentH + paddingY;
    const height = Math.max(size[1] || 0, autoHeight);
    nodes.push({
      key: id,
      width: size[0],
      height,
      bg: n.bg || '#F5FAFF',
      color: baseColor,
      fontSize,
      lines,
    });
    if (parent) links.push({ from: parent._id, to: id });
    if (n.children) for (const c of n.children) walk(c, n);
  }
  walk(root, undefined);
  return { nodes, links };
}

const GoJsOrg: React.FC<{ data: TreeNode }> = ({ data }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const diagramRef = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, ref.current, {
      initialAutoScale: go.Diagram.Uniform,
      'undoManager.isEnabled': true,
      layout: $(go.TreeLayout, {
        angle: 90,
        layerSpacing: 40,
        alignment: go.TreeLayout.AlignmentCenter,
      }),
      'draggingTool.isEnabled': true,
      'toolManager.hoverDelay': 100,
    });

    // Node template: rounded rect with per-line text + tags
    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      { selectionAdorned: true },
      $(go.Shape, 'RoundedRectangle', new go.Binding('fill', 'bg'), {
        stroke: '#dfe7ff',
        strokeWidth: 1,
        parameter1: 10,
      }),
      $(
        go.Panel,
        'Table',
        { padding: 8 },
        $(
          go.Panel,
          'Vertical',
          { row: 0, column: 0, columnSpan: 2, alignment: go.Spot.TopLeft },
          new go.Binding('itemArray', 'lines'),
          {
            itemTemplate: $(
              go.Panel,
              'Table',
              {
                defaultAlignment: go.Spot.Center,
                margin: new go.Margin(0, 0, 4, 0),
              },
              $(
                go.TextBlock,
                { name: 'NAME', row: 0, column: 0 },
                new go.Binding('text', 'text'),
                new go.Binding('stroke', 'color'),
                new go.Binding(
                  'font',
                  'fontSize',
                  (fs, obj) =>
                    `${fs || obj.part.data.fontSize || 14}px sans-serif`,
                ),
                { wrap: go.TextBlock.WrapFit, textAlign: 'left', maxLines: 3 },
              ),
              $(
                go.Panel,
                'Horizontal',
                { row: 0, column: 1, alignment: go.Spot.Center },
                new go.Binding('itemArray', 'tags'),
                {
                  itemTemplate: $(
                    go.Panel,
                    'Auto',
                    { margin: new go.Margin(0, 6, 0, 0) },
                    $(
                      go.Shape,
                      'RoundedRectangle',
                      new go.Binding('fill', 'bg'),
                      new go.Binding(
                        'stroke',
                        'borderColor',
                        (v) => v || '#dfe7ff',
                      ),
                      { strokeWidth: 1, parameter1: 8 },
                    ),
                    $(
                      go.TextBlock,
                      new go.Binding('text'),
                      new go.Binding('stroke', 'color'),
                      {
                        margin: new go.Margin(4, 8, 4, 8),
                        font: '12px sans-serif',
                      },
                    ),
                  ),
                },
              ),
              $(
                go.TextBlock,
                {
                  row: 1,
                  column: 0,
                  columnSpan: 2,
                  alignment: go.Spot.Left,
                  margin: new go.Margin(2, 0, 0, 0),
                },
                new go.Binding('text', 'tip'),
                new go.Binding('stroke', 'tip', (v) =>
                  v ? '#191f2599' : 'transparent',
                ),
                new go.Binding('visible', 'tip', (v) => !!v),
                {
                  font: '11px sans-serif',
                  wrap: go.TextBlock.WrapFit,
                  textAlign: 'left',
                  maxLines: 2,
                },
              ),
            ),
          },
        ),
      ),
      // size bindings
      new go.Binding(
        'desiredSize',
        '',
        (d) => new go.Size(d.width || 180, d.height || 56),
      ),
    );

    // link template: orthogonal routing
    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Orthogonal, corner: 8, selectable: false },
      $(go.Shape, { stroke: '#3949f7', strokeWidth: 2 }),
    );

    const { nodes, links } = treeToNodesAndLinks(data);
    diagram.model = new go.GraphLinksModel(nodes, links);

    diagramRef.current = diagram;

    return () => {
      diagramRef.current = null;
      diagram.div = null as any;
      diagram.clear();
    };
  }, [data]);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', minHeight: 320 }} />
  );
};

export default GoJsOrg;
