export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { session_id, name, email, html } = req.body || {};

  if (!email || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
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
