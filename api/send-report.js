export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, profileName, driveLabel, amorLabel, drivePara, amorPara, gap, matches, closing } = req.body;

  if (!email || !name || !profileName) return res.status(400).json({ error: 'Missing required fields' });

  const gapBlock = gap ? `
    <tr><td style="padding:0 0 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FBF0EF;border-left:4px solid #C42B28;border-radius:8px;">
        <tr><td style="padding:28px 28px;">
          <p style="font-family:Georgia,serif;font-size:18px;color:#141414;margin:0 0 10px;font-weight:400;">${gap.title}</p>
          <p style="font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.75;margin:0;">${gap.text}</p>
        </td></tr>
      </table>
    </td></tr>` : '';

  const matchBlocks = (matches || []).map(m => `
    <tr><td style="padding:0 0 12px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e8e8e8;border-radius:8px;">
        <tr><td style="padding:20px 24px;">
          <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#141414;margin:0 0 6px;">${m.name}</p>
          <p style="font-family:Arial,sans-serif;font-size:14px;color:#555;line-height:1.65;margin:0;">${m.sentence}</p>
        </td></tr>
      </table>
    </td></tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your DrivAmor Profile</title></head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F6F2;">
<tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

  <!-- HEADER -->
  <tr><td style="background:#0F0D16;border-radius:12px 12px 0 0;padding:56px 48px 48px;text-align:center;">
    <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0 0 16px;">${name}, meet your profile.</p>
    <h1 style="font-family:Georgia,serif;font-size:48px;font-weight:400;color:#ffffff;margin:0 0 12px;line-height:1.1;">${profileName}</h1>
    <p style="font-family:Arial,sans-serif;font-size:14px;margin:0;letter-spacing:0.04em;">
      <span style="color:#4A90C4;">${driveLabel}</span>
      <span style="color:rgba(255,255,255,0.3);margin:0 8px;">·</span>
      <span style="color:#E04A46;">${amorLabel}</span>
    </p>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#ffffff;padding:48px 48px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">

    <!-- DRIVE -->
    <tr><td style="padding:0 0 32px;">
      <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;margin:0 0 12px;">Your Drive</p>
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:#141414;margin:0 0 16px;">How you move.</p>
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.85;margin:0;">${drivePara}</p>
    </td></tr>

    <tr><td style="border-top:1px solid #efefef;padding:0 0 32px;"></td></tr>

    <!-- AMOR -->
    <tr><td style="padding:32px 0 32px;">
      <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;margin:0 0 12px;">Your Amor Code</p>
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:#141414;margin:0 0 16px;">How you love.</p>
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.85;margin:0;">${amorPara}</p>
    </td></tr>

    ${gap ? `<tr><td style="border-top:1px solid #efefef;padding:0 0 32px;"></td></tr>
    <tr><td style="padding:32px 0 0;">
      <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;margin:0 0 12px;">There's something else.</p>
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:#141414;margin:0 0 20px;">The gap most people never see.</p>
      ${gapBlock}
    </td></tr>` : ''}

    <tr><td style="border-top:1px solid #efefef;padding:0 0 32px;"></td></tr>

    <!-- MATCHES -->
    <tr><td style="padding:32px 0 0;">
      <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;margin:0 0 12px;">Who you connect with</p>
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:#141414;margin:0 0 20px;">The profiles you naturally draw.</p>
      ${matchBlocks}
    </td></tr>

  </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="background:#0F0D16;padding:56px 48px;text-align:center;">
    <p style="font-family:Georgia,serif;font-size:26px;font-weight:400;color:#ffffff;margin:0 0 12px;line-height:1.3;">The full picture is in the comprehensive report.</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.5);margin:0 0 32px;line-height:1.7;">Your secondary types, your Drive Gap, your Amor Gap, how your profile connects with others — and the pairing that will challenge you most.</p>
    <a href="https://www.drivamor.com/upgrade" style="display:inline-block;background:#ffffff;color:#0F0D16;font-family:Arial,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.04em;text-decoration:none;padding:16px 40px;border-radius:4px;">Get the full report — $14.99</a>
  </td></tr>

  <!-- CLOSING -->
  <tr><td style="background:#F8F6F2;padding:40px 48px;border-radius:0 0 12px 12px;">
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#888;line-height:1.85;margin:0 0 24px;font-style:italic;">${closing.replace(/\n/g, '<br><br>')}</p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#bbb;margin:0;">
      DrivAmor · <a href="https://www.drivamor.com" style="color:#bbb;">drivamor.com</a><br>
      You received this because you completed the DrivAmor assessment.<br>
      <a href="https://www.drivamor.com/unsubscribe" style="color:#bbb;">Unsubscribe</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DrivAmor <hello@drivamor.com>',
        to: [email],
        subject: `${name}, your DrivAmor profile is here — ${profileName}`,
        html
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Email failed to send' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
