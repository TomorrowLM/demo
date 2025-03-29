/**
 * 
 * 写一个方法，输入是一个数组，输出是一棵树，没有pid的作为树的根节点，节点之间通过pid串联，如果 对象a的pid 等于对象b的id，则认为对象a是对象b的子节点
    输入:
    [
        {
            id: '1',
            name: '1',
        },
        {
            id: '2',
            name: '2',
            pid: '1',

        },
        {
            id: '3',
            name: '3',
            pid: '1',
        },
        {
            id: '4',
            name: '4',
            pid: '2',
        },
    ];

    输出:
    {
        id: '1',
        name: 'name',
        children: [
            {
                id: '2',
                name: '2',
                pid: '1',
                children: [
                    {
                        id: '4',
                        name: '4',
                        pid: '2',
                    }
                ]
            },
            {
                id: '3',
                name: '3',
                pid: '1',
            },
        ]
    }
 */

interface Params {
  id: string,
  name: string,
  pid?: string
}

interface Result {
  id: string,
  name: string,
  children?: Result[],
}

const arr = [
  {
    id: '1',
    name: '1',
  },
  {
    id: '2',
    name: '2',
    pid: '1',

  },
  {
    id: '3',
    name: '3',
    pid: '1',
  },
  {
    id: '4',
    name: '4',
    pid: '2',
  },
];

export function buildTree(data: Params[]): Result {
  const idsObj: { [key: string]: any } = {}
  const tree: Result[] = []
  data.forEach(node => {
    idsObj[node.id] = { ...node, children: [] }
  });
  data.forEach(node => {
    if (node.pid) {//存在父级
      if (idsObj[node.pid]) {
        idsObj[node.pid].children.push(idsObj[node.id]);
        // delete idsObj[node.id].pid
      }
    } else {
      tree.push(idsObj[node.id])
    }
  });
  return tree[0];
}

console.log(buildTree(arr))
