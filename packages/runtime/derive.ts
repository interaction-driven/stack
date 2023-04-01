import {ConceptType, FunctionBool, DerivedConceptType} from "../base/types";

/**
 *
 * Role 是 ConceptType, 而 userRole 是用户定义的 Concept，是 Role 的实例。
 * 用户可以从任何用户自己定义的 Concept(也就是ConceptType 的实例) 中继续 derive 出新的 Concept
 *
 * 例子：
 * 1. 从一个原始的类型 derive 如来
 * deriveConcept<RuntimeUser>
 *
 * 2. 从一个 derive 出来的类型继续 Derive
 */

// CAUTION 任何 Concept 定义出来之后，都会有系统自动生成 runtime 时的 Type 类型，这个是真正代码运行时要用到的。
//  生成的 RuntimeType 会自动继承 Concept
interface RuntimeConcept {
    [k: string]: any
}


// 每一个 derive 出来的 concept，也会有系统自动生成的 runtime Type
export function deriveConcept<ConceptRuntimeType extends RuntimeConcept>(concept: ConceptType, attributiveBody: FunctionBool<ConceptRuntimeType>['body']) : DerivedConceptType<ConceptRuntimeType>{
    return {
        type: concept.type,
        concept,
        attributive: {
            type: 'eventStackComputation',
            name: attributiveBody.name,
            body: {
                type: 'functionBool',
                name: attributiveBody.name,
                body: attributiveBody
            },
        }
    }
}
