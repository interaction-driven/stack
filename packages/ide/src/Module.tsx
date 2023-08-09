import { Graph, Cell, Node, Path } from '@antv/x6'
// import { Keyboard } from '@antv/x6-plugin-keyboard'
// import { Selection } from '@antv/x6-plugin-selection'
// @ts-ignore
import Hierarchy from '@antv/hierarchy'
// @ts-ignore
import insertCss from 'insert-css'

import {useLayoutEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import globalCommand from './store/command.ts'
import EmptyIcon from './assets/empty.svg'

// 定义样式
insertCss(`
  .topic-image {
    visibility: hidden;
    cursor: pointer;
  }
  .x6-node-selected rect {
    stroke-width: 2px;
  }
`)

// 自定义节点
Graph.registerNode(
    'topic',
    {
        inherit: 'rect',
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'image',
                selector: 'img',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
        attrs: {
            body: {
                rx: 6,
                ry: 6,
                // stroke: '#5F95FF',
                // fill: '#EFF4FF',
                fill: '#d9d9d9',
                strokeWidth: 0,
            },
            img: {
                ref: 'body',
                refX: '100%',
                refY: '50%',
                refY2: -8,
                width: 16,
                height: 16,
                'xlink:href':
                    'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ',
                event: 'add:topic',
                class: 'topic-image',
            },
            label: {
                fontSize: 14,
                // fill: '#262626',
                fill: '#2c2c2c',
            },
        },
    },
    true,
)

// 连接器？
Graph.registerConnector(
    'mindmap',
    (sourcePoint, targetPoint, routerPoints, options) => {
        const midX = sourcePoint.x + 10
        const midY = sourcePoint.y
        const ctrX = (targetPoint.x - midX) / 5 + midX
        const ctrY = targetPoint.y
        const pathData = `
     M ${sourcePoint.x} ${sourcePoint.y}
     L ${midX} ${midY}
     Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
    `
        return options.raw ? Path.parse(pathData) : pathData
    },
    true,
)

// 自定义边
// 边
// TODO: 边的颜色按理是有逻辑关系的，同一个祖先节点下面所有的边应该是同一色系，并且颜色越来越浅，这里先随机
const colors = ['#E36161', '#FF974B', '#F6BD16', '#FDA5A5', '#FDA5A5', '#C68BF2']
Graph.registerEdge(
  "mindmap-edge",
  {
    inherit: "edge",
    connector: {
      name: "smooth",
      args: {
        direction: 'H',
      }
    },
    attrs: {
      line: {
        targetMarker: "",
        stroke: "#A2B1C3",
        strokeWidth: 3,
      },
    },
    zIndex: 0,
  },
  true
);

interface MindMapData {
    id: string
    type: 'topic' | 'topic-branch' | 'topic-child'
    label: string
    width?: number
    height?: number
    children?: MindMapData[]
}

interface HierarchyResult {
    id: string
    x: number
    y: number
    data: MindMapData
    children?: HierarchyResult[]
}

const  commonNodeSize = {
    width: 70,
    height: 36
}

export default function Module() {
  const [empty, toggle] = useState(true);
  const testData: MindMapData = {
    id: "1",
    type: "topic",
    label: "站点",
    children: [
      {
        id: "1-1",
        type: "topic-branch",
        label: "关系",
        children: [
          {
            id: "1-1-1",
            type: "topic-branch",
            label: "个人",
          },
          {
            id: "1-1-2",
            type: "topic-branch",
            label: "群组",
          },
        ],
      },
      {
        id: "1-3",
        type: "topic-branch",
        label: "积分",
      },
      {
        id: "1-2",
        type: "topic-branch",
        label: "内容",
        children: [
          {
            id: "1-2-1",
            type: "topic-branch",
            label: "帖子",
          },
          {
            id: "1-2-2",
            type: "topic-branch",
            label: "评论",
          },
        ],
      },
    ],
  };

  // 创建画布
  let graph: Graph;

  const render = (data: MindMapData = testData) => {
    const result: HierarchyResult = Hierarchy.mindmap(data, {
      direction: "H",
      getHeight(d: MindMapData) {
        return d.height || commonNodeSize.height;
      },
      getWidth(d: MindMapData) {
        return d.width || commonNodeSize.width;
      },
      getHGap() {
        return 40;
      },
      getVGap() {
        return 20;
      },
      getSide: () => {
        return "right";
      },
    });
    const cells: Cell[] = [];
    const traverse = (hierarchyItem: HierarchyResult) => {
      if (hierarchyItem) {
        const { data, children } = hierarchyItem;
        cells.push(
          graph.createNode({
            id: data.id,
            shape: data.type === "topic-child" ? "topic-child" : "topic",
            x: hierarchyItem.x,
            y: hierarchyItem.y,
            ...commonNodeSize,
            label: data.label,
            type: data.type,
            attrs: {
              body: {
                fill: data.type === 'topic' ? '#d9d9d9' : '#f2f2f2',
              },
            },
          })
        );
        if (children) {
          children.forEach((item: HierarchyResult) => {
            const { id, data } = item;
            cells.push(
              graph.createEdge({
                shape: "mindmap-edge",
                attrs: {
                  line: {
                    stroke: colors[Math.floor(Math.random() * colors.length)],
                  },
                },
                source: {
                  cell: hierarchyItem.id,
                  anchor:
                    data.type === "topic-child"
                      ? {
                          name: "right",
                          args: {
                            dx: -16,
                          },
                        }
                      : {
                          name: "midSide",
                          // args: {
                          //   dx: "25%",
                          // },
                        },
                },
                target: {
                  cell: id,
                  anchor: {
                    name: "left",
                  },
                },
              })
            );
            traverse(item);
          });
        }
      }
    };
    traverse(result);
    graph.resetCells(cells);
    graph.centerContent();
  };

  const findItem = (
    obj: MindMapData,
    id: string
  ): {
    parent: MindMapData | null;
    node: MindMapData | null;
  } | null => {
    if (obj.id === id) {
      return {
        parent: null,
        node: obj,
      };
    }
    const { children } = obj;
    if (children) {
      for (let i = 0, len = children.length; i < len; i += 1) {
        const res = findItem(children[i], id);
        if (res) {
          return {
            parent: res.parent || obj,
            node: res.node,
          };
        }
      }
    }
    return null;
  };

  const navigate = useNavigate();

  useLayoutEffect(() => {
    graph = new Graph({
      container: containerRef.current!,
      connecting: {
        connectionPoint: "anchor",
      },
    });

    // graph.use(new Selection({enabled: true}))
    graph.on("cell:dblclick", ({ e, x, y, cell, view }) => {
      navigate("/module/1/activity");
    });

    globalCommand.showModule = (data: MindMapData) => {
      toggle(false);
      render(data);
    };
  }, []);

  const containerRef = useRef(null);

  return (
    <>
      {empty && (
        <div className="absolute h-full w-full flex justify-center items-center">
          <EmptyIcon />
        </div>
      )}
      <div className="h-full" ref={containerRef}></div>
    </>
  );
}