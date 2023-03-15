# assistant

SOE - Service Orchestration Engine

User sends message to SOE through Whatsapp
SOE request AI to identify user intent
Intent is retrieved to SOE
SOE handles intent and contacts other service
Retreives answer to whatsapp

Services to support:

- WhatsApp Cloud API
- Mongo databases management

Integration of services could be handled as microservices

ENV vars:
PORT
WHATSAPP_VERIFY_TOKEN
WHATSAPP_TOKEN
WHATSAPP_RECIPIENT_PHONE
