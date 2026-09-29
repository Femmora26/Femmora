# Femmora API

Webhook handler para Yampi → Brevo.

## Variável de ambiente (Vercel)

| Variável | Valor |
|----------|-------|
| `BREVO_KEY` | API Key do Brevo |

## Endpoint

`POST /api/yampi-webhook` — recebe eventos do Yampi e envia email de entrega do ebook via Brevo.
