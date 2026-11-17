import nodemailer from 'nodemailer'

const emailPattern = /^[^<>\s@,]+@[^<>\s@,]+\.[^<>\s@,]+$/

export function getSmtpConfig(env) {
  const host = String(env.SMTP_HOST || '').trim()
  const port = Number(env.SMTP_PORT || 587)
  const user = String(env.SMTP_USER || '').trim()
  // Passwords are opaque. Preserve #, &, entities, quotes, and whitespace exactly.
  const pass = env.SMTP_PASSWORD
  const from = String(env.SMTP_FROM_EMAIL || user).trim()
  const sender = from.match(/^(?:[^<>\r\n]*<)?([^<>\s@]+@[^<>\s@]+\.[^<>\s@]+)>?$/)?.[1]
  const to = String(env.CONTACT_RECIPIENT_EMAILS || env.CONTACT_EMAIL || user).split(',').map(value => value.trim()).filter(Boolean)

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || typeof pass !== 'string' || !pass || !sender || /[\r\n]/.test(from) || !to.length || to.some(value => !emailPattern.test(value))) {
    throw new Error('Invalid SMTP configuration')
  }

  return {
    options: {
      host,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      disableFileAccess: true,
      disableUrlAccess: true,
    },
    from,
    to,
  }
}

export async function sendSmtpEmail(env, message) {
  let transport
  try {
    const { options, from, to } = getSmtpConfig(env)
    transport = nodemailer.createTransport(options)
    const result = await transport.sendMail({ ...message, from, to })
    return { ok: result.accepted?.length === to.length && !result.rejected?.length }
  } catch (error) {
    // Provider responses may contain credentials or visitor data. Log only known codes.
    const code = ['EAUTH', 'ECONNECTION', 'ETIMEDOUT', 'ESOCKET', 'EENVELOPE', 'EMESSAGE'].includes(error.code) ? error.code : 'SMTP_FAILED'
    return { ok: false, code }
  } finally {
    transport?.close()
  }
}
