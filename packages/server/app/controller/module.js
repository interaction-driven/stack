const { Controller } = require('egg');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { AIMessage, HumanMessage, SystemMessage } = require('langchain/schema');
const { StructuredOutputParser, OutputFixingParser } = require('langchain/output_parsers');
const { z } = require('zod');

require('dotenv').config();

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo', // gpt4 又用不了
  temperature: 0,
});

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

const outputFixingParser = OutputFixingParser.fromLLM(model, outputParser);

const systemPrompt = `
You are an excellent product designer. Based on the user's needs, you can assist them in designing an ideal product.
Please list the overall functional modules of the product in the following format:
${outputFixingParser.getFormatInstructions()}
`;

const historyCache = {};

class ChatController extends Controller {
  async index() {
    const { ctx } = this;
    const { id, message } = ctx.request.body;
    let messages = historyCache[id];
    console.log('history: ', historyCache[id], 'message: ', message);
    if (!messages) {
      messages = [new SystemMessage(systemPrompt)];
      historyCache[id] = messages;
    }
    messages.push(new HumanMessage(message));
    const output = await model.call(messages);
    messages.push(new AIMessage(output.content));
    console.log('result: ', output.content, messages);
    const modules = await outputFixingParser.parse(output.content);
    console.log('modules: ', modules);

    ctx.body = modules;
  }
}

module.exports = ChatController;
