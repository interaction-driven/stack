

/******************/
// 逻辑运算
export interface BoolExpression {
    type: string
}

interface BOOL extends BoolExpression {
}


export interface AND extends BoolExpression{
    type: 'and',
    left: BoolExpression,
    right: BoolExpression,
}

export interface OR extends BoolExpression {
    type: 'or',
    left: BoolExpression,
    right: BoolExpression,
}

export interface NOT extends BoolExpression{
    type: 'not',
    body: BoolExpression,
}

/*************** 值系统 *******************/
// 比较系统
interface Comparable {
    type: any
}

interface CompareExpression extends BoolExpression {

}
// 默认提供的数值
interface EQUAL<T extends Comparable> extends CompareExpression {
    type: 'equal',
    left: T,
    right: T,
}
interface GT<T extends Comparable> extends CompareExpression {
    type: 'gt',
    left: T,
    right: T,
}
interface LT<T extends Comparable> extends CompareExpression {
    type: 'lt',
    left: T,
    right: T,
}
// CAUTION  理论上这里用户可以无限扩展，比如针对地理位置的 NEAR/WITHIN 等，只要实现 BoolExpression 就行
// TODO 文本、地理位置、颜色，等值系统的


/********************* 事件栈计算表达式系统 *****************/
// 事件栈需求
// CAUTION 这里的 user 和 payload 类型是运行时的类型，应该是根据具体的 interactions 定义生成出来的。这里只是个占位，为了给 EventStackComputation 用
type InteractionInstance = any
export type InteractionStack = InteractionInstance[]


/**
 * EventStackComputation 的例子
 *
 * 1 能对事件栈整体做匹配？相当于一种快捷计算？
 * EXIST(User blocked this.user)
 *
 * 2 能获取事件栈的具体 property，相当于快捷计算？
 * LT(this.user.age, 5)
 *
 * 3 支持常见的表达式计算？应该是值系统支持什么这里就应该能支持什么表达式
 * LT(this.user.age * 3, 5)
 *
 * TODO 这里是在对 EventStackComputation 转换成声明式。要考虑的是"要到什么程度"才是能应用我们的自动优化实现的？例如缓存一下信息到实体、全局表上？
 */

// TODO 好像不能只是定义个这么简单的东西，可能还有更复杂的？
// TODO ? 还需要定义下 body? body 还可是计算表达式，例如加减乘除？那肯定就还有扩展的地理位置、颜色等运算啊
interface PropertyGetter extends Comparable {

}

export interface InteractionStackComputation<T> extends BoolExpression {
    type: 'interactionStackComputation',
    name: string,
    body: BoolExpression | FunctionBool<T>,
}

/**
 * User blocked this.user 就是例子
 */
// TODO  body 就是 interaction 类似的？ 只不过 Role 之类的可以换成当前引用或者  imperative function?
interface EventStackMatcherBody {

}

interface InteractionStackMatcher {
    type: 'interactionStackMatcher',
    body: EventStackMatcherBody
}

// 对事件栈的计算
interface EXIST extends BoolExpression {
    type: 'exist',
    body: InteractionStack,
    constraint: InteractionStackMatcher
}

interface COUNT extends Comparable {
    type: 'number'
    body: InteractionStack,
    constraint: InteractionStackMatcher
}


export interface SystemState {
    timestamp: number
}

/****************** 命令式逃生舱 ********************/
// TODO 为什么这两个就够了？
// CAUTION 这个 function 有可能是计算出来的任何东西，但一定是 comparable，这样才能继续被上层利用。不然没法和上面的静态系统结合了。
// 这样所有接受  Comparable 的地方都可以写函数

export type RuntimeFnBody<T> = (...rest: any[]) => Comparable

export interface FunctionComparable<T> extends Comparable{
    name: string,
    body: RuntimeFnBody<T>
}

// 这样所有接受  BOOL/BoolExpression 的地方都可以写函数
export interface FunctionBool<T> extends BOOL {
    type: 'functionBool'
    name: string,
    body: (...rest: any[]) => boolean
    // body: (stack: EventStack, event: Event, system: SystemState, ref: T) => boolean
}


/******************/
/**
 * 现在系统里面只有 Role 这种 ConceptType
 * 用户可以自定义 Entity/Value/Message 等等 ConceptType
 * 这些自已继承的都可以放到 Payload 里面
 */
export interface ConceptType {
    type: string,
    attributes?: {
        [k: string]: any
    }
}

/**
 *
 *
 * DerivedConceptType 就是在 Concept type 上加了 attributive
 *
 */
export interface DerivedConceptType<RuntimeConcept> extends ConceptType{
    concept: ConceptType,
    attributive: InteractionStackComputation<RuntimeConcept>
}


export interface RoleType extends ConceptType{
}

// export type RoleTypeLike = RoleType | DerivedConceptType<RoleType>
export type RoleTypeLike = RoleType | DerivedConceptType<RoleType>

/******************/

export type ConceptTypeLike = ConceptType | DerivedConceptType<ConceptType>

export type Payload = ConceptTypeLike | ConceptTypeLike[] | Map<string, ConceptTypeLike>

/******************/
export type Interaction = {
    condition?: InteractionStackComputation<null>,
    role: RoleTypeLike,
    action: string,
    payload?: Payload,
    sideEffects?: SideEffect[]
}



/******************/

export type Gateway = {
    // TODO exclusive 需要增加 port，相当于 switch
    type: 'exclusive' | 'parallel' | 'inclusive' | 'computation'
    start: boolean,
    condition?: InteractionStackComputation<null>,
}



// interaction group
export interface Group extends Activity{
    type: string,
    completeCondition?: InteractionStackComputation<null>
}


export type SideEffect = {
    type: string,
    name: string,
    body: (...rest: any[]) => any
}


export type AddAs<T> = T & {
    as?:string
}

export type InActivityRole = AddAs<RoleTypeLike>


export type InActivityPayload = AddAs<ConceptTypeLike> | AddAs<ConceptTypeLike>[] | Map<string, AddAs<ConceptTypeLike>>


export type InstanceRef = {
    // interaction as 同名
    ref: string,
    // 可以指向一个局部，例如  payload 可以是个复杂结构
    index?: string[]
}

export interface InnerInteraction extends Omit<Interaction, 'role' | 'payload'> {
    // reference name，用来被其他 interaction 里面引用的的。
    role: InActivityRole | InstanceRef,
    payload?: InActivityPayload | InstanceRef
}


export type End = {
    type: 'end'
}

export type Direction = {
    from: InnerInteraction | Gateway | Group,
    to: InnerInteraction | Gateway | Group | End,
}

export type Event = any


export type Activity = {
    interactions: {
        [k: string]: InnerInteraction
    },
    directions?: Direction[],
    gateways?: Gateway[],
    groups?: {
        [k: string]: Group,
    },
    events?: Event[]
    sideEffects?: SideEffect[],
}

