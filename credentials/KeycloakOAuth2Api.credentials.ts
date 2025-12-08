import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class KeycloakOAuth2Api implements ICredentialType {
	name = 'keycloakOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Keycloak OAuth2 API';

	icon: Icon = { light: 'file:../icons/keycloak.svg', dark: 'file:../icons/keycloak.dark.svg' };

	documentationUrl = 'https://phasetwo.io/docs/audit-logs/webhooks/';

	properties: INodeProperties[] = [
        {
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: '"authorizationCode',
		},
		{
            displayName: 'Server URL',
            name: 'server',
            type: 'string',
            default: '',
            placeholder: 'https://your-keycloak-instance.com',
            required: true,
            description: 'The URL of your Keycloak server.',
        },
        {
            displayName: 'Default realm',
            name: 'defaultRealm',
            type: 'string',
            default: 'master',
            required: false,
            description: 'The default realm of your Keycloak server.',
        },
        {
            displayName: 'Relative path',
            name: 'relativePath',
            type: 'string',
            default: '',
            required: false,
            description: 'The relative path your Keycloak server, like /auth.',
        },
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
            placeholder: 'Your Client ID',
            required: false,
            description: 'Client ID for obtaining the token.',
        },
        {
            displayName: 'Client Secret',
            name: 'clientSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            placeholder: 'Your Client Secret',
            required: false,
            description: 'Client Secret for obtaining the token.',
        },
        {
			displayName: 'Server base URL',
			name: 'baseUrl',
			type: 'hidden',
			default: '={{$self["server"] + $self["relativePath"] + "/" + "realms/" + $self["defaultRealm"]}}',
			required: true,
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: '={{$self["baseUrl"]}}/protocol/openid-connect/auth',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '={{$self["baseUrl"]}}/protocol/openid-connect/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'service_account offline_access',
		},
	];
}
