import {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError } from 'n8n-workflow';

// eslint-disable-next-line import-x/no-unresolved
import { keycloakApiRequest, makeSecret } from './GenericFunctions';

const KEYCLOAK_EVENTS = [
	{
		name: 'Access.*',
		value: 'access.*',
		description: 'Triggered on registration, login and account management actions',
	},
	{
		name: 'Access.Login',
		value: 'access.LOGIN',
		description: 'A user has logged in',
	},
	{
		name: 'Access.LoginError',
		value: 'access.LOGIN_ERROR',
		description: 'A user login error has occured',
	},
	{
		name: 'Access.Register',
		value: 'access.REGISTER',
		description: 'A user has registered',
	},
	{
		name: 'Access.RegisterError',
		value: 'access.REGISTER_ERROR',
		description: 'A user registration error has occured',
	},
	{
		name: 'Access.Logout',
		value: 'access.LOGOUT',
		description: 'A user has logged out',
	},
	{
		name: 'Access.LogoutError',
		value: 'access.LOGOUT_ERROR',
		description: 'A user logout error has occured',
	},
	{
		name: 'Access.CodeToToken',
		value: 'access.CODE_TO_TOKEN',
		description: 'An application/client has exchanged a code for a token',
	},
	{
		name: 'Access.RefreshToken',
		value: 'access.REFRESH_TOKEN',
		description: 'An application/client has refreshed a token',
	},
	{
		name: 'Access.RefreshTokenError',
		value: 'access.REFRESH_TOKEN_ERROR',
		description: 'An error occurred while refreshing an application/client token',
	},
	{
		name: 'Access.SocialLink',
		value: 'access.SOCIAL_LINK',
		description: 'An account has been linked to a social provider',
	},
	{
		name: 'Access.RemoveSocialLink',
		value: 'access.REMOVE_SOCIAL_LINK',
		description: 'A social provider has been removed from an account',
	},
	{
		name: 'Access.UpdateEmail',
		value: 'access.UPDATE_EMAIL',
		description: 'The email address for an account has changed',
	},
	{
		name: 'Access.UpdateProfile',
		value: 'access.UPDATE_PROFILE',
		description: 'The profile for an account has changed',
	},
	{
		name: 'Access.ResetPassword',
		value: 'access.RESET_PASSWORD',
		description: 'A password reset has been requested',
	},
	{
		name: 'Access.ResetPassword',
		value: 'access.RESET_PASSWORD_ERROR',
		description: 'An error occured while resetting password',
	},
	{
		name: 'Access.SendResetPassword',
		value: 'access.SEND_RESET_PASSWORD',
		description: 'A password reset email has been sent',
	},
	{
		name: 'Access.SendResetPassword',
		value: 'access.SEND_RESET_PASSWORD_ERROR',
		description: 'An error occured while sending password reset email',
	},
	{
		name: 'Access.UpdatePassword',
		value: 'access.UPDATE_PASSWORD',
		description: 'The password for an account has changed (deprecated, use UpdateCredential instead)',
	},
	{
		name: 'Access.UpdatePasswordError',
		value: 'access.UPDATE_PASSWORD_ERROR',
		description: 'A password update error occured (deprecated, use UpdateCredentialError instead)',
	},
	{
		name: 'Access.UpdateCredential',
		value: 'access.UPDATE_CREDENTIAL',
		description: 'The password for an account has changed',
	},
	{
		name: 'Access.UpdateCredentialError',
		value: 'access.UPDATE_CREDENTIAL_ERROR',
		description: 'A credential update error occured',
	},
	{
		name: 'Access.UpdateTOTP',
		value: 'access.UPDATE_TOTP',
		description: 'The TOTP settings for an account have changed',
	},
	{
		name: 'Access.RemoveTOTP',
		value: 'access.REMOVE_TOTP',
		description: 'TOTP has been removed from an account',
	},
	{
		name: 'Access.RemoveCredential',
		value: 'access.REMOVE_CREDENTIAL',
		description: 'Credential has been removed from an account',
	},
	{
		name: 'Access.SendVerifyEmail',
		value: 'access.SEND_VERIFY_EMAIL',
		description: 'An email verification email has been sent',
	},
	{
		name: 'Access.VerifyEmail',
		value: 'access.VERIFY_EMAIL',
		description: 'The email address for an account has been verified',
	},
	{
		name: 'Admin.*',
		value: 'admin.*',
		description: "Triggered on actions performed using the administrative API",
	},
	{
		name: 'Admin.UserCreate',
		value: 'admin.USER-CREATE',
		description: "A user has been created",
	},
	{
		name: 'Admin.UserUpdate',
		value: 'admin.USER-UPDATE',
		description: "A User has been updated",
	},
	{
		name: 'Admin.UserDelete',
		value: 'admin.USER-DELETE',
		description: "A User has been deleted",
	},
	{
		name: 'Admin.UserAction',
		value: 'admin.USER-ACTION',
		description: "ACTION is a placeholder for actions that do not fit the classic CRUD model for a user resource",
	},
	{
		name: 'Admin.User*',
		value: 'admin.USER-*',
		description: "All user related events",
	},
	{
		name: 'Admin.GroupCreate',
		value: 'admin.GROUP-CREATE',
		description: "A group has been created",
	},
	{
		name: 'Admin.GroupUpdate',
		value: 'admin.GROUP-UPDATE',
		description: "A group has been updated",
	},
	{
		name: 'Admin.GroupDelete',
		value: 'admin.GROUP-DELETE',
		description: "A group has been deleted",
	},
	{
		name: 'Admin.Group*',
		value: 'admin.GROUP-*',
		description: "All group related events",
	},
	{
		name: 'Admin.GroupMembershipCreate',
		value: 'admin.GROUP_MEMBERSHIP-CREATE',
		description: "A group membership has been created",
	},
	{
		name: 'Admin.GroupMembershipUpdate',
		value: 'admin.GROUP_MEMBERSHIP-UPDATE',
		description: "A group membership has been updated",
	},
	{
		name: 'Admin.GroupMembershipDelete',
		value: 'admin.GROUP_MEMBERSHIP-DELETE',
		description: "A group membership has been deleted",
	},
	{
		name: 'Admin.GroupMembership*',
		value: 'admin.GROUP_MEMBERSHIP-*',
		description: "All group membership related events",
	},
	{
		name: 'Admin.ClientCreate',
		value: 'admin.CLIENT-CREATE',
		description: "A client has been created",
	},
	{
		name: 'Admin.ClientUpdate',
		value: 'admin.CLIENT-UPDATE',
		description: "A client has been updated",
	},
	{
		name: 'Admin.ClientDelete',
		value: 'admin.CLIENT-DELETE',
		description: "A client has been deleted",
	},
	{
		name: 'Admin.Client*',
		value: 'admin.CLIENT-*',
		description: "All client related events",
	},
	{
		name: 'Admin.UserLoginFailure',
		value: 'admin.USER_LOGIN_FAILURE',
		description: "User login failure",
	},
];

export class KeycloakTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Keycloak Trigger',
		name: 'keycloakTrigger',
		icon: 'file:keycloak.svg',
		group: ['trigger'],
		version: 1,
		subtitle:
			'={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when Keycloak events occur',
		defaults: {
			name: 'Keycloak Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'keycloakOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'oAuth2',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					...KEYCLOAK_EVENTS,
					{
						name: '*',
						value: '*',
						description: 'Any time any event is triggered (Wildcard Event)',
					},
				],
				required: true,
				default: [],
				description: 'The events to listen to',
			},
		],
		usableAsTool: true,
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
					return false;
				}

				// Webhook got created before so check if it still exists

				const endpoint = `/webhooks/${webhookData.webhookId}`;

				try {
					await keycloakApiRequest.call(this, 'GET', endpoint, {});
				} catch (error) {
					if (error.cause.httpCode === '404' || error.description.includes('404')) {
						// Webhook does not exist
						delete webhookData.webhookId;
						delete webhookData.webhookEvents;

						return false;
					}

					// Some error occured
					throw error;
				}

				// If it did not error then the webhook exists
				return true;
			},
			/**
			 * Keycloak API - Add event hook:
			 * https://github.com/p2-inc/keycloak-events
			 * https://phasetwo.io/docs/audit-logs/webhooks/
			 */
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');

				let eventsArray = this.getNodeParameter('events', []) as string[];
				if (eventsArray.includes('*')) {
					eventsArray = ["*"];
				}

				const endpoint = `/webhooks`;

				const body = {
					url: webhookUrl,
					eventTypes: eventsArray,
					enabled: true,
					secret: makeSecret()
				};

				let responseData;
				try {
					responseData = await keycloakApiRequest.call(this, 'POST', endpoint, body);
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}

				if (responseData.id === undefined) {
					// Required data is missing so was not successful
					throw new NodeApiError(this.getNode(), responseData as JsonObject, {
						message: 'Keycloak webhook creation response did not contain the expected data.',
					});
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData.id as string;
				webhookData.webhookEvents = eventsArray;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {

					const endpoint = `/webhooks/${webhookData.webhookId}`;
					const body = {};

					try {
						await keycloakApiRequest.call(this, 'DELETE', endpoint, body);
					} catch (error) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		const returnData: IDataObject[] = [];

		returnData.push({
			body: bodyData,
			headers: this.getHeaderData(),
			query: this.getQueryData(),
		});

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
