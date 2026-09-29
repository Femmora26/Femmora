const BREVO_KEY = process.env.BREVO_KEY;
const BREVO_TEMPLATE_ID = 1;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const evento = req.body?.event;
  const cliente = req.body?.data?.customer || req.body?.data?.order?.customer;

  if (evento !== 'order.paid') {
    return res.status(200).json({ skipped: true, event: evento });
  }

  const email = cliente?.email;
  const nome = cliente?.name || cliente?.first_name || 'Cliente';
  const primeiroNome = nome.split(' ')[0];

  if (!email) {
    return res.status(400).json({ error: 'email não encontrado no payload' });
  }

  const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
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

  const resultado = await brevoRes.json();
  return res.status(200).json({ ok: true, brevo: resultado });
}
