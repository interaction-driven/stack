
type Id =  string|number

interface Box {
    id: Id,
    width: number,
    height: number
}

interface Edge {
    source: string|number,
    target: string|number,
}

interface Position {
    x: number,
    y: number
}

interface LayoutNode extends Box{
    x: number;
    y: number;
    boxWidth: number;
    rank: number;
    children?:LayoutNode[]
}

type Layer = Id[]




function createLayers(nodes: Box[], edges: Edge[]) {
    const nodeMap = new Map<Id, LayoutNode>()
    const layers: LayoutNode[][] = []


    nodes.forEach((node) => {
        nodeMap.set(node.id, { x: 0, y: 0, boxWidth: 0, rank: 0, ...node})
    })

    const visited = new Set<LayoutNode>();
    const sourceToTarget = new Map<Id, Set<Id>>();

    const headCandidates = new Set(nodes.map(e => e.id));
    const tailCandidates = new Set(nodes.map(e => e.id));

    edges.forEach(edge => {
        headCandidates.delete(edge.target)
        tailCandidates.delete(edge.source)
        if (!sourceToTarget.get(edge.source)) {
            sourceToTarget.set(edge.source, new Set<Id>())
        }

        sourceToTarget.get(edge.source)!.add(edge.target)
    })

    if (headCandidates.size < 1) throw new Error('no head')
    if (tailCandidates.size < 1) throw new Error('no tail')



    function visit(node: LayoutNode, rank: number) {
        node.rank = Math.max(node.rank, rank);

        if (visited.has(node)) return;

        if (!layers[rank]) layers[rank] = []
        layers[rank].push(node)
        visited.add(node);

        const directChildren: LayoutNode[] = []

        sourceToTarget.get(node.id)?.forEach((childId) => {
            const child = nodeMap.get(childId)!
            if (!visited.has(child)) {
                directChildren.push(child)
            }
            visit(child, rank+1)
        })

        if (directChildren.length) {
            node.children = directChildren
        }
    }

    const headsIds = [...headCandidates]

    const heads = headsIds.map(headId => {
        return nodeMap.get(headId)!
    })
    heads.forEach(head => visit(head, 0))

    return { heads, nodeMap, layers};
}

interface PartialLayoutNode {
    width: number,
    children? : PartialLayoutNode[],
    boxWidth? :number
}

function assignBoxWidth(node: PartialLayoutNode, nodeDistance: number) {
    const childrenWidth = node.children?.length ?
        (
            node.children.reduce((last: number, currentChild) => last + assignBoxWidth(currentChild, nodeDistance), 0)
            + (node.children.length - 1) * nodeDistance
        ) :
        0

    node.boxWidth = Math.max(node.width, childrenWidth)
    return node.boxWidth
}

function assignPosition(nodes: LayoutNode[], layerDistance: number, nodeDistance: number, parentOffsetX: number, topOffsets: number[]) {
    let prevSiblingRight = 0
    nodes.forEach((node, index) => {
        const siblingOffsetX = prevSiblingRight + (index === 0 ? 0 : nodeDistance)

        node.x = parentOffsetX + siblingOffsetX + node.boxWidth/2 - node.width/2
        node.y = topOffsets[node.rank]

        if (node.children) {
            assignPosition(node.children, layerDistance, nodeDistance, parentOffsetX + siblingOffsetX, topOffsets)
        }

        prevSiblingRight = siblingOffsetX + node.boxWidth
    })
}


function calculateLayerTopOffsets(layers: LayoutNode[][], layerDistance: number) {
    const heights = layers.map( nodes => Math.max(...nodes.map(node => node.height)))
    let lastBottom = 0
    const result: number[] = []
    heights.forEach((height, index) => {
        const thisTop = lastBottom + (index === 0? 0 : layerDistance)
        result.push( thisTop )
        lastBottom = thisTop + height
    })
    // CAUTION 最后一个放进去得到的是 totalHeight，外面要用
    result.push(lastBottom)
    return result
}

export default function layout(boxes: Box[], edges: Edge[], layerDistance: number = 10, nodeDistance: number = 10) {
    const { heads, nodeMap, layers} = createLayers(boxes, edges);
    const container = { width: 0, children: heads, boxWidth: 0 }
    assignBoxWidth(container, nodeDistance)
    const topOffsets = calculateLayerTopOffsets(layers, layerDistance)
    assignPosition(heads, layerDistance, nodeDistance, 0, topOffsets);

    return { nodeMap, width: container.boxWidth, height: topOffsets.at(-1) };
}

