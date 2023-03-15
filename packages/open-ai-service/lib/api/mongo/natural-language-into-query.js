const MODULE_ID = 'open-ai-service-mongo-natural-language-into-query';

const { Configuration, OpenAIApi } = require('openai');
const ramda = require('ramda');

const naturalLanguageIntoQuery = async (params) => {
  try {
    const NATURAL_QUERY = ramda.pathOr(
      'Find all documents where the "name" field equals "John"',
      ['naturalQuery'],
      params
    );
    const PROMT = `As a MongoDB developer, write a query that convert the following natural language query into a MongoDB query using mandatorily the 'db.collection' function instead of using the shorthand notation 'db.<collectionName>': "${NATURAL_QUERY}"\n\nMongoDB Query:`;
    console.log('[NAVA] PROMT :', PROMT);
    // TODO: SEPARTE THIS INTO INITIALIZATION AND SERVICE USE
    //const openaiApiKey = process.env.OPEN_AI_SERVICE_API_KEY;
    const configuration = new Configuration({
      apiKey: process.env.OPEN_AI_SERVICE_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // from here
    const completion = await openai.createChatCompletion({
      model: process.env.OPEN_AI_SERVICE_API_MODEL,
      messages: [{ role: 'user', content: PROMT }],
    });
    const RET_VAL = completion?.data?.choices[0]?.message;

    return RET_VAL;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  naturalLanguageIntoQuery,
};
