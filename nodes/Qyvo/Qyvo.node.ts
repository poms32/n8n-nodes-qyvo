import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Qyvo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Qyvo',
    name: 'qyvo',
    icon: 'file:qyvo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Send WhatsApp templates, manage contacts, trigger sequences and flows on Qyvo',
    defaults: {
      name: 'Qyvo',
    },
    usableAsTool: true,
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'qyvoApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.baseUrl}}',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      // ============== RESOURCE ==============
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Contact', value: 'contact' },
          { name: 'Flow', value: 'flow' },
          { name: 'Message', value: 'message' },
          { name: 'Sequence', value: 'sequence' },
          { name: 'Tag', value: 'tag' },
          { name: 'Template', value: 'template' },
        ],
        default: 'message',
      },

      // ============== CONTACT OPERATIONS ==============
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['contact'] } },
        options: [
          {
            name: 'Add Tag',
            value: 'addTag',
            action: 'Add a tag to a contact',
            routing: { request: { method: 'POST', url: '/api/v1/actions/add-tag' } },
          },
          {
            name: 'Create',
            value: 'create',
            action: 'Create a contact',
            routing: { request: { method: 'POST', url: '/api/v1/actions/create-contact' } },
          },
          {
            name: 'Get',
            value: 'get',
            action: 'Get a contact',
            routing: { request: { method: 'POST', url: '/api/v1/actions/get-contact' } },
          },
          {
            name: 'Remove Tag',
            value: 'removeTag',
            action: 'Remove a tag from a contact',
            routing: { request: { method: 'POST', url: '/api/v1/actions/remove-tag' } },
          },
          {
            name: 'Search',
            value: 'search',
            action: 'Search contacts',
            routing: { request: { method: 'POST', url: '/api/v1/actions/search-contacts' } },
          },
          {
            name: 'Update',
            value: 'update',
            action: 'Update a contact',
            routing: { request: { method: 'POST', url: '/api/v1/actions/update-contact' } },
          },
        ],
        default: 'create',
      },

      // ============== MESSAGE OPERATIONS ==============
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['message'] } },
        options: [
          {
            name: 'Send Text',
            value: 'sendText',
            // eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
            action: 'Send a free-form text message',
            description: 'Only works inside the 24-hour conversation window. Outside it, send a template instead.',
            routing: { request: { method: 'POST', url: '/api/v1/actions/send-text-message' } },
          },
          {
            name: 'Send Template',
            value: 'sendTemplate',
            // eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
            action: 'Send an approved WhatsApp template',
            routing: {
              request: { method: 'POST', url: '/api/v1/actions/send-template-message' },
            },
          },
        ],
        default: 'sendTemplate',
      },

      // ============== TEMPLATE OPERATIONS ==============
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['template'] } },
        options: [
          {
            name: 'List',
            value: 'list',
            action: 'List templates',
            routing: { request: { method: 'POST', url: '/api/v1/actions/list-templates' } },
          },
          {
            name: 'Get',
            value: 'get',
            action: 'Get a template',
            routing: { request: { method: 'POST', url: '/api/v1/actions/get-template' } },
          },
        ],
        default: 'list',
      },

      // ============== TAG OPERATIONS ==============
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['tag'] } },
        options: [
          {
            name: 'List',
            value: 'list',
            action: 'List tags',
            routing: { request: { method: 'POST', url: '/api/v1/actions/list-tags' } },
          },
        ],
        default: 'list',
      },

      // ============== SEQUENCE OPERATIONS ==============
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['sequence'] } },
        options: [
          {
            name: 'Trigger',
            value: 'trigger',
            action: 'Trigger a sequence for a contact',
            routing: { request: { method: 'POST', url: '/api/v1/actions/trigger-sequence' } },
          },
        ],
        default: 'trigger',
      },

      // ============== FLOW OPERATIONS ==============
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['flow'] } },
        options: [
          {
            name: 'Trigger',
            value: 'trigger',
            action: 'Trigger a flow for a contact',
            routing: { request: { method: 'POST', url: '/api/v1/actions/trigger-flow' } },
          },
        ],
        default: 'trigger',
      },

      // ====================================================================
      // CONTACT FIELDS
      // ====================================================================
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        placeholder: '+33612345678',
        description: 'Contact phone number in E.164 format',
        displayOptions: {
          show: { resource: ['contact'], operation: ['create'] },
        },
        routing: { request: { body: { phone: '={{$value}}' } } },
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        placeholder: '+33612345678',
        description: 'Required if Contact ID is not provided',
        displayOptions: {
          show: { resource: ['contact'], operation: ['update', 'get', 'addTag', 'removeTag'] },
        },
        routing: { request: { body: { phone: '={{$value}}' } } },
      },
      {
        displayName: 'Contact ID',
        name: 'contact_id',
        type: 'string',
        default: '',
        description: 'Qyvo contact UUID. Provide either Contact ID or Phone.',
        displayOptions: {
          show: { resource: ['contact'], operation: ['update', 'get', 'addTag', 'removeTag'] },
        },
        routing: { request: { body: { contact_id: '={{$value}}' } } },
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        displayOptions: {
          show: { resource: ['contact'], operation: ['create', 'update'] },
        },
        routing: { request: { body: { name: '={{$value}}' } } },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        placeholder: 'name@example.com',
        displayOptions: {
          show: { resource: ['contact'], operation: ['create', 'update', 'get'] },
        },
        routing: { request: { body: { email: '={{$value}}' } } },
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        placeholder: 'vip,fr,newsletter',
        description: 'Comma-separated tag names',
        displayOptions: {
          show: { resource: ['contact'], operation: ['create', 'update'] },
        },
        routing: { request: { body: { tags: '={{$value}}' } } },
      },
      {
        displayName: 'Metadata (JSON)',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Custom metadata to store on the contact',
        displayOptions: {
          show: { resource: ['contact'], operation: ['create', 'update'] },
        },
        routing: { request: { body: { metadata: '={{JSON.parse($value)}}' } } },
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: { resource: ['contact'], operation: ['addTag', 'removeTag'] },
        },
        routing: { request: { body: { tag: '={{$value}}' } } },
      },

      // CONTACT SEARCH
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        description: 'Searches phone, name and email (substring, case-insensitive)',
        displayOptions: {
          show: { resource: ['contact'], operation: ['search'] },
        },
        routing: { request: { body: { query: '={{$value}}' } } },
      },
      {
        displayName: 'Filter by Tag',
        name: 'tag',
        type: 'string',
        default: '',
        displayOptions: {
          show: { resource: ['contact'], operation: ['search'] },
        },
        routing: { request: { body: { tag: '={{$value}}' } } },
      },
      {
        displayName: 'Filter by Email',
        name: 'email',
        type: 'string',
								placeholder: 'name@email.com',
        default: '',
        displayOptions: {
          show: { resource: ['contact'], operation: ['search'] },
        },
        routing: { request: { body: { email: '={{$value}}' } } },
      },

      // ====================================================================
      // MESSAGE FIELDS
      // ====================================================================
      {
        displayName: 'To (Phone Number)',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        placeholder: '+33612345678',
        description: 'Recipient phone number in E.164 format',
        displayOptions: {
          show: { resource: ['message'] },
        },
        routing: { request: { body: { phone: '={{$value}}' } } },
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: { rows: 4 },
        required: true,
        default: '',
        description:
          'Free-form text. WhatsApp only allows this within 24h of the contact\'s last inbound message; otherwise use a template.',
        displayOptions: {
          show: { resource: ['message'], operation: ['sendText'] },
        },
        routing: { request: { body: { message: '={{$value}}' } } },
      },
      {
        displayName: 'Template Name or ID',
        name: 'template_id',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getTemplates' },
        required: true,
        default: '',
        description: 'Approved WhatsApp template to send. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        displayOptions: {
          show: { resource: ['message'], operation: ['sendTemplate'] },
        },
        routing: { request: { body: { template_id: '={{$value}}' } } },
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        placeholder: 'en, fr, es…',
        description:
          'BCP-47 language code of the template translation. Leave empty to use the template default.',
        displayOptions: {
          show: { resource: ['message'], operation: ['sendTemplate'] },
        },
        routing: { request: { body: { language: '={{$value}}' } } },
      },
      {
        displayName: 'Variables (JSON)',
        name: 'variables',
        type: 'json',
        default: '{}',
        description: 'Object whose values fill the template body placeholders in order. Example: {"1": "John", "2": "ORDER-1234"}.',
        displayOptions: {
          show: { resource: ['message'], operation: ['sendTemplate'] },
        },
        routing: { request: { body: { variables: '={{JSON.parse($value)}}' } } },
      },

      // ====================================================================
      // TEMPLATE FIELDS
      // ====================================================================
      {
        displayName: 'Template ID',
        name: 'template_id',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: { resource: ['template'], operation: ['get'] },
        },
        routing: { request: { body: { template_id: '={{$value}}' } } },
      },
      {
        displayName: 'Status Filter',
        name: 'status',
        type: 'options',
        default: '',
        options: [
          { name: 'Any', value: '' },
          { name: 'Approved', value: 'APPROVED' },
          { name: 'Pending', value: 'PENDING' },
          { name: 'Rejected', value: 'REJECTED' },
        ],
        displayOptions: {
          show: { resource: ['template'], operation: ['list'] },
        },
        routing: { request: { body: { status: '={{$value || undefined}}' } } },
      },

      // ====================================================================
      // TAG FIELDS (List)
      // ====================================================================
      {
        displayName: 'Name Contains',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter tags whose name contains this substring',
        displayOptions: {
          show: { resource: ['tag'], operation: ['list'] },
        },
        routing: { request: { body: { name: '={{$value}}' } } },
      },

      // ====================================================================
      // SEQUENCE / FLOW FIELDS
      // ====================================================================
      {
        displayName: 'Sequence Name or ID',
        name: 'sequence_id',
        type: 'options',
								description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: { loadOptionsMethod: 'getSequences' },
        required: true,
        default: '',
        displayOptions: {
          show: { resource: ['sequence'], operation: ['trigger'] },
        },
        routing: { request: { body: { sequence_id: '={{$value}}' } } },
      },
      {
        displayName: 'Flow Name or ID',
        name: 'flow_id',
        type: 'options',
								description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: { loadOptionsMethod: 'getFlows' },
        required: true,
        default: '',
        displayOptions: {
          show: { resource: ['flow'], operation: ['trigger'] },
        },
        routing: { request: { body: { flow_id: '={{$value}}' } } },
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        placeholder: '+33612345678',
        description: 'Required if Contact ID is not provided',
        displayOptions: {
          show: { resource: ['sequence', 'flow'], operation: ['trigger'] },
        },
        routing: { request: { body: { phone: '={{$value}}' } } },
      },
      {
        displayName: 'Contact ID',
        name: 'contact_id',
        type: 'string',
        default: '',
        description: 'Qyvo contact UUID. Provide either Contact ID or Phone.',
        displayOptions: {
          show: { resource: ['sequence', 'flow'], operation: ['trigger'] },
        },
        routing: { request: { body: { contact_id: '={{$value}}' } } },
      },
      {
        displayName: 'Context (JSON)',
        name: 'context',
        type: 'json',
        default: '{}',
        description: 'Optional context object passed to the sequence or flow',
        displayOptions: {
          show: { resource: ['sequence', 'flow'], operation: ['trigger'] },
        },
        routing: { request: { body: { context: '={{JSON.parse($value)}}' } } },
      },
    ],
  };

  methods = {
    loadOptions: {
      async getTemplates(this: any) {
        const response = await this.helpers.httpRequestWithAuthentication.call(
          this,
          'qyvoApi',
          {
            method: 'GET',
            url: '/api/v1/dropdowns/templates',
            json: true,
          },
        );
        return (response as Array<{ id: string; label: string }>).map((t) => ({
          name: t.label,
          value: t.id,
        }));
      },
      async getSequences(this: any) {
        const response = await this.helpers.httpRequestWithAuthentication.call(
          this,
          'qyvoApi',
          {
            method: 'GET',
            url: '/api/v1/dropdowns/sequences',
            json: true,
          },
        );
        return (response as Array<{ id: string; label: string }>).map((s) => ({
          name: s.label,
          value: s.id,
        }));
      },
      async getFlows(this: any) {
        const response = await this.helpers.httpRequestWithAuthentication.call(
          this,
          'qyvoApi',
          {
            method: 'GET',
            url: '/api/v1/dropdowns/flows',
            json: true,
          },
        );
        return (response as Array<{ id: string; label: string }>).map((f) => ({
          name: f.label,
          value: f.id,
        }));
      },
    },
  };
}
