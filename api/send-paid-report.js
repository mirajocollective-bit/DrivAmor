export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { session_id, name, email, html } = req.body || {};

  if (!session_id || !email || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verify the Stripe session was actually paid before sending the report
  try {
    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
      }
    });

    if (!stripeRes.ok) {
      console.error('Stripe session lookup failed:', await stripeRes.text());
      return res.status(402).json({ error: 'Could not verify payment' });
    }

    const session = await stripeRes.json();

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' });
    }

    // Make sure the session email matches what was submitted (prevents session_id reuse)
    const sessionEmail = session.customer_details?.email || session.customer_email || '';
    if (sessionEmail && sessionEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Session mismatch' });
    }
  } catch (err) {
    console.error('Stripe verification error:', err);
    return res.status(500).json({ error: 'Payment verification failed' });
  }

  // Send email
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DrivAmor <hello@drivamor.com>',
        to: [email],
        subject: `${name ? name + ', your' : 'Your'} DrivAmor comprehensive report is here`,
        html
      })
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Email failed to send' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
