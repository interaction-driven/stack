const { Controller } = require('egg');
const { ConversationChain } = require('langchain/chains');
const { PromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, ChatPromptTemplate } = require('langchain/prompts');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { SystemMessage, AIMessage, HumanMessage } = require('langchain/schema');
const { ChatMessageHistory, BufferMemory } = require('langchain/memory');
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

const TEMPLATE = `
You are an excellent product designer. Based on the user's needs, you can assist them in designing an ideal product.
Please list the overall functional modules of the product in the following format:
{schema}
`;

const prompt = new PromptTemplate({
  template: TEMPLATE,
  inputVariables: [],
  partialVariables: { schema: outputFixingParser.getFormatInstructions() },
});

const systemPrompt = new SystemMessagePromptTemplate(prompt);
// const humanPrompt = HumanMessagePromptTemplate.fromTemplate('{message}');

// const memoryKey = 'history';
const historyCache = {};

class ChatController extends Controller {
  async index() {
    const { ctx } = this;
    const { id, message } = ctx.request.body;
    let messages = historyCache[id];
    console.log('history: ', historyCache[id], 'message: ', message);
    if (!messages) {
      messages = [
        await systemPrompt.format()
      ];
      historyCache[id] = messages;
    }
    messages.push(new HumanMessage(message));
    // const memory = history ?
    //   new BufferMemory({ chatHistory: new ChatMessageHistory(history), memoryKey }) :
    //   new BufferMemory({ memoryKey });
    // const messages = history ? [systemPrompt, new MessagesPlaceholder(memoryKey), humanPrompt] : [systemPrompt, humanPrompt];
    // const chatPrompt = ChatPromptTemplate.fromPromptMessages(messages);
    // const chain = new ConversationChain({ llm: model, memory, prompt: chatPrompt, verbose: true });
    // historyCache[id] = memory.chatHistory.messages;

    const output = await model.call(messages);
    messages.push(new AIMessage(output.content));
    console.log('result: ', output.content, messages);
    const modules = await outputFixingParser.parse(output.content);
    console.log('modules: ', modules);
    // const result = await model.call(messages);
    // 因为要返回一个完整的结构，所以没法用 streaming 的形式逐个 token 返回结果
    // const output = await outputParser.parse(result.content);

    ctx.body = modules;
  }
}

module.exports = ChatController;
