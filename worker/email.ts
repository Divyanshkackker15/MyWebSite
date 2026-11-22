/**
 * The email you receive for each contact-form message. Table layout and
 * inline styles only, because that's what email clients reliably render.
 * Every visitor-supplied value is escaped before it goes into the HTML.
 */
export interface Message {
  name: string
  email: string
  subject: string
  message: string
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const FONT = "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif"
const MONO = "'Geist Mono','SFMono-Regular',Menlo,Consolas,monospace"

export function renderEmail(m: Message, receivedAt: Date) {
  const when = receivedAt.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  const reply = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent('Re: ' + m.subject)}`
  const label = (t: string) =>
    `<p style="margin:0 0 8px;font-family:${MONO};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#6b6b6b;">${t}</p>`

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(m.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#000000;" bgcolor="#000000">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#000000;">${esc(m.name)}: ${esc(m.message.slice(0, 120))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background:#000000;">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr>
          <td style="padding:0 0 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${MONO};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#f5f5f5;">Divyansh Kackker</td>
                <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#6b6b6b;">New message</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#0b0b0b" style="background:#0b0b0b;border:1px solid #1f1f1f;">
            <!-- light line: the site's colours, quietly -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td height="2" style="height:2px;line-height:2px;font-size:0;background:#3d7bff;background-image:linear-gradient(90deg,#3d7bff,#8b5cf6,#e0409a);">&nbsp;</td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:36px 36px 8px;">
                  ${label('Subject')}
                  <h1 style="margin:0;font-family:${FONT};font-size:30px;line-height:1.12;font-weight:500;letter-spacing:-0.8px;color:#f5f5f5;">${esc(m.subject)}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 36px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #1f1f1f;">
                    <tr>
                      <td width="50%" valign="top" style="padding:20px 12px 0 0;">
                        ${label('From')}
                        <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.4;color:#f5f5f5;">${esc(m.name)}</p>
                      </td>
                      <td width="50%" valign="top" style="padding:20px 0 0 12px;">
                        ${label('Email')}
                        <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.4;word-break:break-all;"><a href="mailto:${esc(m.email)}" style="color:#f5f5f5;text-decoration:underline;text-decoration-color:#5c5c5c;">${esc(m.email)}</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 36px 0;">
                  ${label('Message')}
                  <div style="margin:0;padding:20px 22px;border-left:1px solid #f5f5f5;background:#111111;font-family:${FONT};font-size:16px;line-height:1.7;color:#d6d6d6;white-space:pre-wrap;word-wrap:break-word;">${esc(m.message)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 36px 36px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td bgcolor="#f5f5f5" style="background:#f5f5f5;">
                        <a href="${reply}" style="display:inline-block;padding:14px 22px;font-family:${MONO};font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:#000000;text-decoration:none;">Reply to ${esc(m.name.split(' ')[0] || m.name)} &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 0 0;">
            <p style="margin:0;font-family:${MONO};font-size:11px;line-height:1.7;letter-spacing:1.2px;text-transform:uppercase;color:#5c5c5c;">
              Sent from the contact form on kackkerdivyansh.in<br>${esc(when)} IST · Replying goes straight to ${esc(m.name.split(' ')[0] || 'the sender')}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  const text = [
    `New message from the contact form on kackkerdivyansh.in`,
    ``,
    `From:    ${m.name} <${m.email}>`,
    `Subject: ${m.subject}`,
    `When:    ${when} IST`,
    ``,
    m.message,
    ``,
    `Reply to this email to answer ${m.name}.`,
  ].join('\n')

  return { html, text }
}
