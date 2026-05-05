import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class QyvoApi implements ICredentialType {
  name = 'qyvoApi';

  displayName = 'Qyvo API';

  // eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
  documentationUrl = 'https://www.qyvo.io/docs/api';

  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description:
        'Personal access token generated at Qyvo → Settings → API Tokens. Treat it like a password.',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://www.qyvo.io',
      description:
        'Override only if you self-host Qyvo. Default points at the production cloud.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiToken}}',
        Accept: 'application/json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/v1/me',
    },
  };
}
