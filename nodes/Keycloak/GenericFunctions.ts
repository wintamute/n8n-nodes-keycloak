/* eslint-disable @n8n/community-nodes/no-deprecated-workflow-functions */
import type {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';


/**
 * Make an API request to Keycloak
 *
 */
export async function keycloakApiRequest(
	this: IHookFunctions | IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: object,
	query?: IDataObject,
	option: IDataObject = {},
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
	const options: IRequestOptions = {
		method,
		headers: {},
		body,
		qs: query,
		uri: '',
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}
	if (query === undefined) {
		delete options.qs;
	}

	try {
		const credentials = await this.getCredentials('keycloakOAuth2Api');

		options.uri = `${(credentials.baseUrl as string).replace(/\/$/, '')}${endpoint}`;
		return await this.helpers.requestWithAuthentication.call(this, 'keycloakOAuth2Api', options);
	} catch (error) {
		this.logger.error(`Got keycloak api error: "${error}"`);
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export function makeSecret() {
	const length = 10;
    let result           = '';
    const characters     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}