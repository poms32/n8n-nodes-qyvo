import {
  IDataObject,
  INodeType,
  INodeTypeDescription,
  IPollFunctions,
  INodeExecutionData,
} from 'n8n-workflow';

const EVENT_ENDPOINTS: Record<string, string> = {
  newMessageReceived: '/api/v1/triggers/new-message-received',
  newCampaignSent: '/api/v1/triggers/new-campaign-sent',
  newFlowTriggered: '/api/v1/triggers/new-flow-triggered',
  newSequenceTriggered: '/api/v1/triggers/new-sequence-triggered',
};

export class QyvoTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Qyvo Trigger',
    name: 'qyvoTrigger',
    icon: 'file:qyvo.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Starts a workflow when something happens on Qyvo',
    defaults: { name: 'Qyvo Trigger' },
    polling: true,
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'qyvoApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        noDataExpression: true,
        default: 'newMessageReceived',
        options: [
          {
            name: 'New Message Received',
            value: 'newMessageReceived',
            description: 'Fires when a contact sends an inbound WhatsApp message',
          },
          {
            name: 'New Campaign Sent',
            value: 'newCampaignSent',
            description: 'Fires when a broadcast campaign finishes sending',
          },
          {
            name: 'New Flow Triggered',
            value: 'newFlowTriggered',
            description: 'Fires when a flow session starts for a contact',
          },
          {
            name: 'New Sequence Triggered',
            value: 'newSequenceTriggered',
            description: 'Fires when a sequence session starts for a contact',
          },
        ],
      },
      {
        displayName: 'Message Type',
        name: 'message_type',
        type: 'options',
        default: '',
        description: 'Filter by inbound message type',
        options: [
          { name: 'Any', value: '' },
          { name: 'Audio', value: 'audio' },
          { name: 'Document', value: 'document' },
          { name: 'Image', value: 'image' },
          { name: 'Location', value: 'location' },
          { name: 'Sticker', value: 'sticker' },
          { name: 'Text', value: 'text' },
          { name: 'Video', value: 'video' },
        ],
        displayOptions: {
          show: { event: ['newMessageReceived'] },
        },
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    const event = this.getNodeParameter('event') as keyof typeof EVENT_ENDPOINTS;
    const url = EVENT_ENDPOINTS[event];
    if (!url) {
      return null;
    }

    const credentials = await this.getCredentials('qyvoApi');
    const baseUrl = (credentials.baseUrl as string)?.replace(/\/$/, '') || 'https://www.qyvo.io';

    const qs: IDataObject = {};
    if (event === 'newMessageReceived') {
      const messageType = this.getNodeParameter('message_type', '') as string;
      if (messageType) qs.message_type = messageType;
    }

    const items = (await this.helpers.httpRequestWithAuthentication.call(this, 'qyvoApi', {
      method: 'GET',
      url: `${baseUrl}${url}`,
      qs,
      json: true,
    })) as IDataObject[];

    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    // Per-node static state: remember which IDs we've already returned so the
    // polling loop only emits new items.
    const staticData = this.getWorkflowStaticData('node') as IDataObject;
    const seen = new Set<string>(((staticData.seenIds as string[]) ?? []).slice(-1000));

    const fresh: IDataObject[] = [];
    for (const item of items) {
      const id = String(item.id ?? '');
      if (!id || seen.has(id)) continue;
      fresh.push(item);
      seen.add(id);
    }

    if (fresh.length === 0) {
      return null;
    }

    // Keep at most the last 1000 IDs to bound state size.
    staticData.seenIds = Array.from(seen).slice(-1000);

    return [this.helpers.returnJsonArray(fresh)];
  }
}
