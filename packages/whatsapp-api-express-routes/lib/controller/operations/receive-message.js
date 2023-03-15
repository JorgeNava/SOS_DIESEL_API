const MODULE_ID = 'whatsapp-api-express-routes-controller-receive-message';

const axios = require('axios');

const { naturalLanguageIntoQuery } = require('open-ai-service');
const { runCommand } = require('assistant-datasource-provider');

const receiveMessage = async (req, res) => {
  let body = req.body;
  const token = process.env.WHATSAPP_TOKEN;
  let WHATSAPP_RESPONSE;

  try {
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from;
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;

        console.log('[NAVA] Message Recevied:', {
          from: from,
          message: msg_body,
        });

        const url =
          'https://graph.facebook.com/v16.0/' +
          phone_number_id +
          '/messages?access_token=' +
          token;
        const RECIPIENT_PHONE = process.env.WHATSAPP_RECIPIENT_PHONE;

        /* 
          TODO: DIVIDE THIS SECTION INTO
          1- HANDLING THE RECEIVED MESSAGE AND GET USER INTENT
          2- DETERMINE WHICH CONTROLLER/API TO USE BASED IN INTENT
          3- GIVE CORRESPONDANT RESPONSE TO USER
        */

        const PARAMS = {
          naturalQuery: msg_body,
        };
        const RESPONSE = await naturalLanguageIntoQuery(PARAMS);
        const QUERY = RESPONSE?.content.replace(/\n/g, '');
        console.log('[NAVA] QUERY :', QUERY);
        WHATSAPP_RESPONSE = `[INPUT]: ${QUERY}`;

        await axios({
          method: 'POST',
          url: url,
          data: {
            messaging_product: 'whatsapp',
            to: RECIPIENT_PHONE,
            text: { body: WHATSAPP_RESPONSE },
          },
          headers: { 'Content-Type': 'application/json' },
        });

        const DATASOURCE_RESPONSE = await runCommand(QUERY);
        console.log('[NAVA] DATASOURCE_RESPONSE :', DATASOURCE_RESPONSE);

        WHATSAPP_RESPONSE = `[OUTPUT]: ${
          DATASOURCE_RESPONSE ? DATASOURCE_RESPONSE : 'An error occurred'
        }`;

        // TODO: PASS AXIOS CALLS INTO SHARED PACKAGE
        await axios({
          method: 'POST',
          url: url,
          data: {
            messaging_product: 'whatsapp',
            to: RECIPIENT_PHONE,
            text: { body: WHATSAPP_RESPONSE },
          },
          headers: { 'Content-Type': 'application/json' },
        });
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  receiveMessage,
};
