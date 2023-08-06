const { ChatOpenAI } = require('langchain/chat_models/openai');
const { AIMessage, HumanMessage } = require('langchain/schema');
const { Controller } = require('egg');
require('dotenv').config();

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  // modelName: 'gpt-4', // 又用不了了……
  temperature: 0,
});

class ChatController extends Controller {
  async index() {
    const { ctx } = this;
    const { messages } = ctx.request.body;
    console.log('messages: ', messages);
    const result = await chat.call(
      messages.map(m => (m.role === 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content))
      ));
    console.log('result: ', result);
    ctx.body = result.content;
  }
}

module.exports = ChatController;
