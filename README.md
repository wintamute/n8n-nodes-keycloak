# n8n-nodes-keycloak

This is an n8n community node. It lets you use Keycloak events in your n8n workflows.

[Keycloak](https://www.keycloak.org/) is an Open Source Identity and Access Manangement solution.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Prerequisites](#prerequisites)  
[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  

## Prerequisites

Before you begin, you’ll need:

- A running keycloak instance
- Installation of the [keycloak-events plugin](https://github.com/wintamute/keycloak-events/tree/webhook_create_response) in your keycloak instance
- Configure the events plugin to enable webhooks
- Create a dedicated client in keycloak for authenticating this trigger node with the necsessary permissions and roles.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

See [event plugin documentation](https://phasetwo.io/docs/audit-logs/)

## Credentials

This trigger node uses OIDC to authenticate agains keycloak. This means you need to use the dedicated client in keycloak ([Prerequisites](#prerequisites)) and create n8n credentials using the client_id and client secret configured in keycloak. Once this is set up correctly you should be able to login via n8n.

## Compatibility

- **Minimum n8n version: 1.123.0**
- Tested against n8n versions: 1.123.0+
- Node.js version: 20 or higher


## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [keycloak-events plugin installation documentation](https://github.com/wintamute/keycloak-events/tree/webhook_create_response)
* [event plugin documentation](https://phasetwo.io/docs/audit-logs/)

## License

This project is licensed under the **MIT License**.


