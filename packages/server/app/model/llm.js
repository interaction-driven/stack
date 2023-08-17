const { ChatOpenAI } = require('langchain/chat_models/openai');
const { AIMessage, HumanMessage, SystemMessage } = require('langchain/schema');
const { OutputFixingParser } = require('langchain/output_parsers');
require('dotenv').config();

// TODO: use redis to store history
const LLMHistory = {};
const CurrentModule = {};

class LLM {
  constructor(systemPrompt, outputParser) {
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo', // gpt4 又用不了
      temperature: 0,
    });
    this.outputFixingParser = OutputFixingParser.fromLLM(this.model, outputParser);
    this.systemPrompt = `${systemPrompt}\n${this.outputFixingParser.getFormatInstructions()}`;
  }

  async call(id, message, moduleId) {
    const { systemPrompt, model, outputFixingParser } = this;
    let messages = LLMHistory[id];
    console.log('=========history: ', LLMHistory[id], 'message: ', systemPrompt);
    if (!messages) {
      messages = [new SystemMessage(systemPrompt)];
      LLMHistory[id] = messages;
    } else if (moduleId && CurrentModule[id] !== moduleId) {
      messages.push(new SystemMessage(systemPrompt));
      CurrentModule[id] = moduleId;
    }
    messages.push(new HumanMessage(message));
    const output = await model.call(messages);
    console.log('========result: ', output.content);
    messages.push(new AIMessage(output.content));
    const modules = await outputFixingParser.parse(output.content);
    console.log('========modules: ', modules);
    return modules;
  }
}

module.exports = {
  LLM,
  LLMHistory,
};
