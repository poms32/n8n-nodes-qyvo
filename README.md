# n8n-nodes-qyvo

Community n8n nodes for [Qyvo](https://www.qyvo.io) — the WhatsApp marketing platform for e-commerce.

Send WhatsApp templates, sync contacts, trigger sequences and flows, and react to incoming messages directly from your n8n workflows.

## Install

In n8n (cloud or self-hosted), open **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-qyvo
```

Or from the command line on a self-hosted instance:

```bash
npm install n8n-nodes-qyvo
```

Then restart n8n.

## Authenticate

1. In Qyvo, go to **Settings → API Tokens** and click **Create token**. Copy the value once — it's only shown to you that one time.
2. In n8n, add a new **Qyvo API** credential and paste the token.
3. Leave **Base URL** as `https://www.qyvo.io` unless you self-host Qyvo.

n8n will hit `GET /api/zapier/me` with the token to verify it.

## Nodes

### Qyvo

Action node grouped by resource:

| Resource   | Operations                                                       |
| ---------- | ---------------------------------------------------------------- |
| Contact    | Create · Update · Get · Search · Add Tag · Remove Tag            |
| Message    | Send Text · Send Template                                         |
| Template   | List · Get                                                        |
| Tag        | List                                                              |
| Sequence   | Trigger                                                           |
| Flow       | Trigger                                                           |

Templates, sequences and flows are exposed as searchable dropdowns powered by your live Qyvo data.

### Qyvo Trigger

Polling trigger. Fires on:

- **New Message Received** — inbound WhatsApp message from a contact (with optional message-type filter)
- **New Campaign Sent** — broadcast campaign finished sending
- **New Flow Triggered** — flow session started for a contact
- **New Sequence Triggered** — sequence session started for a contact

n8n controls the poll interval; the node deduplicates by ID so you never see the same item twice.

## Notes on WhatsApp limits

- **Templates** are the only way to send a message *outside* the 24 h conversation window. They must be approved by Meta in Qyvo before you can use them.
- **Send Text** only works inside the 24 h window after the contact's last inbound message. Outside of it the API returns an error — fall back to a template.
- Phone numbers are normalized server-side, but pass them in **E.164** format (`+33612345678`) for predictable behaviour.

## Develop

```bash
npm install
npm run build       # compile TS + copy SVGs to dist/
npm run dev         # tsc --watch
npm run lint        # eslint with n8n community ruleset
```

To test a local build inside n8n:

```bash
npm run build
npm pack            # produces n8n-nodes-qyvo-x.y.z.tgz
# in your n8n install:
npm install /absolute/path/to/n8n-nodes-qyvo-x.y.z.tgz
```

## License

[MIT](LICENSE)
