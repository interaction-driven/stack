import { activity, activity as activityData, interactions } from '../../../example/activity/friendRequest'

const generateId = (() => {
  let i = 0
  return () => {
    return (i++).toString()
  }
})()

const reqSize = {
  width: 300,
  height: 172,
}

const resSize = {
  width: 232,
  height: 86,
}

const startX = 50
const startY = 56
const hGap = 76
const vGap = 42
const padding = 24
const paddingRight = 140

const calGroupWidth = (num: number) => padding + num * resSize.width + (num - 1) * vGap + paddingRight

const sendNode = {
  shape: 'interaction',
  id: generateId(),
  ...reqSize,
  position: {
    // 故意不加 startX，让 sendNode 相对 group 偏左，连线才有曲线
    x: calGroupWidth(3) / 2 - reqSize.width / 2,
    y: startY,
  },
  data: {
    ...activity.interactions.sendInteraction,
    role: {
      ...activity.interactions.sendInteraction.role,
      name: 'User',
    },
  }
}

const groupTopPadding = 68
const groupBottomPadding = 44

const responseGroupNode = {
  shape: 'group',
  id: generateId(),
  height: resSize.height + groupTopPadding + groupBottomPadding,
  width: calGroupWidth(3),
  position: {
    x: startX,
    y: startY + reqSize.height + hGap,
  },
  data: activity.groups!.responseGroup
}

const calculateX = (index: number) => responseGroupNode.position.x + padding + (vGap + resSize.width) * index
const groupInnerY = responseGroupNode.position.y + groupTopPadding

const approveNode = {
  shape: 'simple-interaction',
  id: generateId(),
  parent: responseGroupNode.id,
  ...resSize,
  position: {
    x: calculateX(0),
    y: groupInnerY
  },
  data: {
    ...activity.groups!.responseGroup.interactions.approveInteraction,
    roleGroup: 'lime-600',
  }
}

const rejectNode = {
  shape: 'simple-interaction',
  id: generateId(),
  parent: responseGroupNode.id,
  ...resSize,
  position: {
    x: calculateX(1),
    y: groupInnerY
  },
  data: {
    ...activity.groups!.responseGroup.interactions.rejectInteraction,
    roleGroup: 'lime-600',
  }
}

const cancelNode = {
  shape: 'simple-interaction',
  id: generateId(),
  parent: responseGroupNode.id,
  ...resSize,
  position: {
    x: calculateX(2),
    y: groupInnerY
  },
  data: activity.groups!.responseGroup.interactions.cancelInteraction
}

const endNode = {
  shape: 'end',
  id: generateId(),
  position: {
    x: startX + calGroupWidth(3) / 2 + 58,
    y: responseGroupNode.position.y + responseGroupNode.height + 60
  },
}

export const nodes = [sendNode, responseGroupNode, approveNode, rejectNode, cancelNode, endNode]
export const edges = [{
  source: sendNode.id,
  target: responseGroupNode.id,
  attrs: {
    line: {
      stroke: '#CECECE',
      strokeWidth: 3,
      targetMarker: null,
    },
  }
}, {
  source: responseGroupNode.id,
  target: {
    cell: endNode.id,
    anchor: 'left',
  },
  // TODO: 只用作 demo，后续需要改成自定义的 connector
  vertices: [
    { x: endNode.position.x - 56, y: endNode.position.y - 40 },
    { x: endNode.position.x - 51, y: endNode.position.y - 20 },
    { x: endNode.position.x - 46, y: endNode.position.y - 10 },
    { x: endNode.position.x - 30, y: endNode.position.y + 10 },
  ],
  connector: {
    name: "rounded",
    args: {
      radius: 60,
    },
  },
  attrs: {
    line: {
      stroke: '#CECECE',
      strokeWidth: 3,
      targetMarker: null,
    },
  }
}]

// export const nodes = [sendNode, responseGroupNode, approveNode, rejectNode, cancelNode]
// export const edges = [{
//     source: sendNode.id,
//     target: responseGroupNode.id,
//     attrs: {
//         line: {
//             stroke: '#CECECE',
//             strokeWidth: 3,
//             targetMarker: null,
//         },
//     }
// }]

