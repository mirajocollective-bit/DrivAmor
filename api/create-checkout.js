export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body || {};

  try {
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('line_items[0][price]', 'price_1TTCMVGUBsX8ruvF63Stt9hE');
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', 'https://www.drivamor.com/success?session_id={CHECKOUT_SESSION_ID}');
    params.append('cancel_url', 'https://www.drivamor.com/upgrade');
    params.append('allow_promotion_codes', 'true');
    if (email) params.append('customer_email', email);
    if (name) params.append('metadata[name]', name);
    if (email) params.append('metadata[email]', email);

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Stripe error:', err);
      return res.status(500).json({ error: 'Checkout creation failed' });
    }

    const session = await response.json();
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
