const BREVO_KEY = process.env.BREVO_KEY;
const BREVO_TEMPLATE_ID = 1;
const UTMIFY_URL = 'https://api.utmify.com.br/webhooks/yampi?id=6a973b4bf6df7d488c5';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body;
  const evento = body?.event;
  const cliente = body?.data?.customer || body?.data?.order?.customer;

  // Relay para UTMify (sempre, independente do evento)
  fetch(UTMIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {});

  // Enviar ebook apenas em compra aprovada
  if (evento === 'order.paid' || evento === 'order.approved') {
    const email = cliente?.email;
    const nome = cliente?.name || cliente?.first_name || 'Cliente';
    const primeiroNome = nome.split(' ')[0];

    if (email) {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [{ email, name: nome }],
          templateId: BREVO_TEMPLATE_ID,
          params: { FIRSTNAME: primeiroNome },
        }),
      });
    }
  }

  return res.status(200).json({ ok: true });
}
