const { Controller } = require('egg');
const { StructuredOutputParser } = require('langchain/output_parsers');
const { z } = require('zod');
const { LLM } = require('../model/llm');

// interface MindMapData {
//   id: string
//   type: 'topic' | 'topic-branch'
//   label: string
//   width?: number
//   height?: number
//   children?: MindMapData[]
// }
const outputParser = StructuredOutputParser.fromZodSchema(
  z.object({
    id: z.string().describe('an unique id'),
    type: z.enum(['topic', 'topic-branch']).describe('topic for root node and topic-branch for other nodes'),
    label: z.string().describe('the text of the node'),
    // width: z.number().optional(),
    // height: z.number().optional(),
    children: z.array(z.lazy(() => outputParser.schema)).optional(),
  })
);

const systemPrompt = `You are an excellent product designer. Based on the user's needs, you can assist them in designing an ideal product.
Please list the overall functional modules of the product in the following format:`;

class ChatController extends Controller {
  async index() {
    const { ctx } = this;
    const { id, message } = ctx.request.body;
    const llm = new LLM(systemPrompt, outputParser);
    const modules = await llm.call(id, message);
    ctx.body = { id, data: modules };
  }
}

module.exports = ChatController;
