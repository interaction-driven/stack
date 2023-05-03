import {activity, activity as activityData, interactions} from '../../../example/activity/friendRequest'


const generateId = (() => {
    let i = 0
    return () => {
        return (i++).toString()
    }
})()

const size = {
    width: 200,
    height: 120,
}

const hGap = 100
const vGap = 50
const padding = 10

const startOffset = 20

const calGroupWidth = (num: number) => padding * 2 + num * size.width + (num -1) * vGap

const sendNode = {
    shape: 'interaction',
    id: generateId(),
    ...size,
    position: {
        x: calGroupWidth(3)/2 + startOffset - size.width/2,
        y: 10,
    },
    data: {
        ...activity.interactions.sendInteraction,
        role: {
            ...activity.interactions.sendInteraction.role,
            name: 'User',
        },
    }
}

const groupTopPadding = 40

const responseGroupNode = {
    shape: 'group',
    id: generateId(),
    height: size.height + groupTopPadding + padding,
    width: calGroupWidth(3),
    position: {
        x: startOffset,
        y: size.height + hGap,
    },
    data: activity.groups!.responseGroup
}


const calculateX = (index: number) => responseGroupNode.position.x + padding + (vGap + size.width) * index
const groupInnerY = responseGroupNode.position.y + groupTopPadding

const approveNode = {
    shape: 'interaction',
    id: generateId(),
    parent: responseGroupNode.id,
    ...size,
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
    shape: 'interaction',
    id: generateId(),
    parent: responseGroupNode.id,
    ...size,
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
    shape: 'interaction',
    id: generateId(),
    parent: responseGroupNode.id,
    ...size,
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
        x: startOffset + calGroupWidth(3)/2 - 25,
        y: groupInnerY + responseGroupNode.height + vGap
    },
}


// export const nodes = [sendNode, responseGroupNode, approveNode, rejectNode, cancelNode, endNode]
// export const edges = [{
//     source: sendNode.id,
//     target: responseGroupNode.id,
//     attrs: {
//         line: {
//             stroke: '#A2B1C3',
//             strokeWidth: 2,
//         },
//     }
// }, {
//     source: responseGroupNode.id,
//     target: endNode.id,
//     attrs: {
//         line: {
//             stroke: '#A2B1C3',
//             strokeWidth: 2,
//         },
//     }
// }]

export const nodes = [sendNode, responseGroupNode, approveNode, rejectNode, cancelNode]
export const edges = [{
    source: sendNode.id,
    target: responseGroupNode.id,
    attrs: {
        line: {
            stroke: '#A2B1C3',
            strokeWidth: 2,
        },
    }
}]

