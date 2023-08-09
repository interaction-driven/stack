const { Controller } = require('egg');
const { LLMChain } = require('langchain/chains');
const { PromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, AIMessagePromptTemplate } = require('langchain/prompts');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { SystemMessage, AIMessage, HumanMessage } = require('langchain/schema');
const { StructuredOutputParser, OutputFixingParser } = require('langchain/output_parsers');
const { z } = require('zod');

require('dotenv').config();

const TEMPLATE = `
You are an excellent product designer. Based on the user's needs, you can assist them in designing an ideal product.
Please list the overall functional modules of the product in the following format:
{schema}
`;

const chatModel = new ChatOpenAI({
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

const outputFixingParser = OutputFixingParser.fromLLM(chatModel, outputParser);

const prompt = new PromptTemplate({
  template: TEMPLATE,
  inputVariables: [],
  partialVariables: { schema: outputFixingParser.getFormatInstructions() },
});

const systemPrompt = new SystemMessagePromptTemplate({ prompt });

// const chain = new LLMChain({
//   llm: chatModel,
//   prompt,
//   outputKey: 'content', // For readability - otherwise the chain output will default to a property named "text"
//   outputParser: outputFixingParser,
// });

class ChatController extends Controller {
  async index() {
    const { ctx } = this;
    const { messages } = ctx.request.body;

    const finalMessages = [
      await systemPrompt.format(),
      ...messages.map(m => (m.role === 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content))
      )];
    console.log('messages: ', finalMessages);
    const result = await chatModel.call(finalMessages);
    const output = await outputParser.parse(result.content);
    // const result = await chain.call(finalMessages);
    console.log('result: ', output);
    ctx.body = output;
  }
}

module.exports = ChatController;
