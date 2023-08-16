const { Controller } = require('egg');
const { StructuredOutputParser } = require('langchain/output_parsers');
const { z } = require('zod');
const { LLM } = require('../model/llm');

// const types = require('../../../base/types');
// export type Activity = {
//     interactions: {
//         [k: string]: InnerInteraction
//     },
//     directions?: Direction[],
//     gateways?: Gateway[],
//     groups?: {
//         [k: string]: Group,
//     },
//     events?: Event[]
//     sideEffects?: SideEffect[],
// }
// export interface InnerInteraction extends Omit<Interaction, 'role' | 'payload'> {
//   // reference name，用来被其他 interaction 里面引用的的。
//   role: InActivityRole | InstanceRef,
//   payload?: InActivityPayload | InstanceRef
// }
// export type Interaction = {
//   condition?: InteractionStackComputation<null>,
//   role: RoleTypeLike,
//   action: string,
//   payload?: Payload,
//   sideEffects?: SideEffect[],
//   targetData?: TargetDataMatcher | TargetDataMatcherFunction
// }
// export type Direction = {
//   from: InnerInteraction | Gateway | Group,
//   to: InnerInteraction | Gateway | Group | End,
// }
// export type Gateway = {
//   // TODO exclusive 需要增加 port，相当于 switch
//   type: 'exclusive' | 'parallel' | 'inclusive' | 'computation'
//   start: boolean,
//   condition?: InteractionStackComputation<null>,
// }
// export interface Group extends Activity{
//   type: string,
//   completeCondition?: InteractionStackComputation<null>
// }
// export type Event = any
// export type SideEffect = {
//   type: string,
//   name: string,
//   body: (...rest: any[]) => any
// }
// export type Payload = ConceptTypeLike | ConceptTypeLike[] | Map<string, ConceptTypeLike>
// export type InActivityRole = AddAs<RoleTypeLike>
// export type AddAs<T> = T & {
//   as?:string
// }
// export type RoleTypeLike = RoleType | DerivedConceptType<RoleType>
// export interface RoleType extends ConceptType{}
// export interface DerivedConceptType<RuntimeConcept> extends ConceptType{
//   concept: ConceptType,
//   attributive: InteractionStackComputation<RuntimeConcept>
// }
// export interface ConceptType {
//   type: string,
//   attributes?: {
//       [k: string]: any
//   }
// }
// export type InActivityPayload = AddAs<ConceptTypeLike> | AddAs<ConceptTypeLike>[] | Map<string, AddAs<ConceptTypeLike>>
// export type ConceptTypeLike = ConceptType | DerivedConceptType<ConceptType>
// export interface InteractionStackComputation<T> extends BoolExpression {
//   type: 'interactionStackComputation',
//   name: string,
//   body: BoolExpression | FunctionBool<T>,
// }
// export interface BoolExpression {
//   type: string
// }
// // 这样所有接受  BOOL/BoolExpression 的地方都可以写函数
// export interface FunctionBool<T> extends BOOL {
//   type: 'functionBool'
//   name: string,
//   body: (...rest: any[]) => boolean
//   // body: (stack: EventStack, event: Event, system: SystemState, ref: T) => boolean
// }
// export type TargetDataMatcher = {}
// export type TargetDataMatcherFunction = (...arg0: any[]) => any
// export type InstanceRef = {
//   // interaction as 同名
//   ref: string,
//   // 可以指向一个局部，例如  payload 可以是个复杂结构
//   index?: string[]
// }

const ConditionSchema = z.object({
  type: z.literal('interactionStackComputation'),
  name: z.string(),
  body: z.function(z.tuple([z.any(), z.any(), z.any(), z.any()]), z.boolean()),
});
const ConceptTypeSchema = z.object({
  type: z.string(),
  attributes: z.record(z.any()),
  as: z.string().optional(),
});
const DerivedConceptTypeSchema = z.object({
  concept: ConceptTypeSchema,
  attributive: ConditionSchema,
});
const ConceptTypeLikeSchema = z.union([ConceptTypeSchema, DerivedConceptTypeSchema]);
const RoleTypeSchema = z.object({
  type: z.string(),
  attributes: z.record(z.any()),
  as: z.string().optional(),
});
const InActivityRoleSchema = z.union([RoleTypeSchema, DerivedConceptTypeSchema]);
const InActivityPayloadSchema = z.union([ConceptTypeLikeSchema, z.array(ConceptTypeLikeSchema), z.record(ConceptTypeLikeSchema)]);

const SideEffectSchema = z.object({
  type: z.string(),
  name: z.string(),
  body: z.function(z.tuple([z.any(), z.any(), z.any(), z.any()]), z.any()),
});
const InstanceRefSchema = z.object({
  ref: z.string(),
  index: z.array(z.string()).optional(),
});
const InnerInteractionSchema = z.object({
  condition: ConditionSchema.optional(),
  role: z.union([InActivityRoleSchema, InstanceRefSchema]),
  action: z.string(),
  payload: z.union([InActivityPayloadSchema, InstanceRefSchema]).optional(),
  sideEffects: z.array(SideEffectSchema).optional(),
  targetData: z.union([z.any(), z.function(z.tuple([z.any(), z.any(), z.any(), z.any()]), z.any())]).optional(),
});
const DirectionSchema = z.object({
  from: z.union([InnerInteractionSchema, z.string()]),
  to: z.union([InnerInteractionSchema, z.string()]),
});
const GatewaySchema = z.object({
  type: z.union([z.literal('exclusive'), z.literal('parallel'), z.literal('inclusive'), z.literal('computation')]),
  start: z.boolean(),
  condition: ConditionSchema.optional(),
});
const GroupSchema = z.object({
  type: z.string(),
  completeCondition: ConditionSchema.optional(),
});
const EventSchema = z.any();
const ActivitySchema = z.object({
  interactions: z.record(InnerInteractionSchema),
  directions: z.array(DirectionSchema).optional(),
  gateways: z.record(GatewaySchema).optional(),
  groups: z.record(GroupSchema).optional(),
  events: z.array(EventSchema).optional(),
  sideEffects: z.array(SideEffectSchema).optional(),
});

const outputParser = StructuredOutputParser.fromZodSchema(ActivitySchema);

const genPrompt = module => `Now let's focus on the module ${module}.
Based on the user's needs, please design the activity diagram of the module in the following format:`;

class ChatController extends Controller {
  async index() {
    const { ctx } = this;
    const { id, module, message } = ctx.request.body;
    console.log('id', id, 'module', module, 'message', message);
    const systemPrompt = genPrompt(module);
    const llm = new LLM(systemPrompt, outputParser);
    const activity = await llm.call(id, message);
    ctx.body = { id, data: activity };
  }
}

module.exports = ChatController;
