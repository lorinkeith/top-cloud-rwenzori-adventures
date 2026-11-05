const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const clean = (value) => String(value ?? '').trim()

const escapeHtml = (value) =>
  clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const json = (payload, status = 200) => new Response(JSON.stringify(payload), { status, headers })

const getEnv = (env, names) => {
  for (const name of names) {
    const value = env?.[name]?.trim().replace(/^(['"])(.*)\1$/, '$2')
    if (value) return value
  }
  return ''
}

const companyName = 'Top Cloud Rwenzori Adventures'
const defaultFromEmail = `${companyName} <onboarding@resend.dev>`

function normalizeSender(value) {
  const sender = clean(value).replace(/^(['"])(.*)\1$/, '$2')
  const bracketEmail = sender.match(/<([^<>\s@]+@[^<>\s@]+\.[^<>\s@]+)>/)
  if (bracketEmail) return `${companyName} <${bracketEmail[1]}>`
  if (/^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/.test(sender)) return `${companyName} <${sender}>`
  return defaultFromEmail
}

const detail = (label, value) => `
  <tr>
    <td width="34%" style="padding:13px 18px; border-bottom:1px solid #d7e7dc; color:#007a24; font-size:13px; font-weight:700; letter-spacing:0.12em; line-height:1.35; text-transform:uppercase; vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:13px 18px; border-bottom:1px solid #d7e7dc; color:#102d23; font-size:15px; line-height:1.45; vertical-align:top;">${escapeHtml(value) || '&mdash;'}</td>
  </tr>
`

function emailShell(title, intro, rows, noteTitle, note) {
  return `
    <div style="margin:0; padding:32px 16px; background:#f4fbf6; font-family:Arial, Helvetica, sans-serif; color:#102d23;">
      <div style="max-width:900px; margin:0 auto; overflow:hidden; border:1px solid #d7e7dc; border-radius:14px; background:#ffffff; box-shadow:0 18px 48px rgba(11,51,36,0.14);">
        <div style="height:124px; padding:38px 48px 0; background:linear-gradient(135deg, #006b1f 0%, #0b3324 100%); color:#ffffff;">
          <div style="font-size:29px; line-height:1.1; font-weight:800; letter-spacing:0.14em;">${companyName}</div>
        </div>
        <div style="padding:34px 48px;">
          <h1 style="margin:0; color:#102d23; font-size:38px; line-height:1.08; font-weight:800;">${escapeHtml(title)}</h1>
          <p style="margin:14px 0 0; color:#5e6761; font-size:16px; line-height:1.65;">${intro}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px; border:1px solid #d7e7dc; border-radius:10px; background:#ffffff; border-collapse:separate; border-spacing:0; overflow:hidden;">
            <tbody>${rows.map(([label, value]) => detail(label, value)).join('')}</tbody>
          </table>
          <div style="margin-top:16px; padding:14px 22px; border:1px solid #bfe3c8; border-radius:10px; background:#f0fbf3;">
            <div style="color:#007a24; font-size:13px; font-weight:700; letter-spacing:0.12em; line-height:1.35; text-transform:uppercase;">${escapeHtml(noteTitle)}</div>
            <div style="margin-top:8px; color:#102d23; font-size:15px; line-height:1.7;">${escapeHtml(note).replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </div>
    </div>
  `
}

async function sendEmail(env, { replyTo, subject, html, text }) {
  const apiKey = getEnv(env, ['RESEND_API_KEY'])
  const from = normalizeSender(getEnv(env, ['RESEND_FROM_EMAIL']))
  const to = getEnv(env, ['CONTACT_EMAIL'])

  if (!apiKey || !from || !to) {
    return { ok: false, status: 500, message: 'Email settings are missing. Please check your configured email keys and try again.' }
  }

  let response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject,
        html,
        text,
      }),
    })
  } catch {
    return { ok: false, status: 502, message: 'Could not reach the email service. Please try again or contact us on WhatsApp.' }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    return { ok: false, status: 502, message: error?.message || 'The request could not be sent right now.' }
  }

  return { ok: true }
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers })
}

export async function onRequestPost({ request, env }) {
  if (Number(request.headers.get('content-length')) > 32768) return json({message:'Request too large.'},413)
  let body
  try {
    body = await request.json()
  } catch {
    return json({ message: 'Invalid request body.' }, 400)
  }

  if (JSON.stringify(body).length > 32768) return json({message:'Request too large.'},413)
  const formType = clean(body?.formType)
  const fullName = clean(body?.fullName)
  const email = clean(body?.email).toLowerCase()
  const phone = clean(body?.phone)

  if (!fullName || !email || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ message: 'Please complete every required field with a valid email address.' }, 400)
  }

  if (!['inquiry','booking'].includes(formType)) return json({ message: 'Invalid form type.' },400)

  const submittedAt = new Date().toLocaleString('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  })

  if (formType === 'inquiry') {
    const message = clean(body?.message)
    if (!message) return json({ message: 'Please add a message before sending.' }, 400)

    const rows = [
      ['Form type', 'General Inquiry'],
      ['Full name', fullName],
      ['Email address', email],
      ['Phone / WhatsApp', phone],
      ['Submitted', submittedAt],
    ]
    const inquirySubject = `New Inquiry from ${companyName} Website`
    const text = [inquirySubject, '', ...rows.map(([label, value]) => `${label}: ${value}`), '', 'Message:', message].join('\n')
    const html = emailShell('New website inquiry', `${escapeHtml(fullName)} submitted a general inquiry from the website.`, rows, 'Message', message)
    return persistAndNotify(env, body, { replyTo: email, subject: inquirySubject, html, text })
  }

  const selectedTour = clean(body?.selectedTour)
  const country = clean(body?.country)
  const travelDate = clean(body?.travelDate)
  const adults = Number(body?.adults ?? 0)
  const children = Number(body?.children ?? 0)
  const notes = clean(body?.notes)

  if (!selectedTour || !country || !travelDate || !Number.isInteger(adults) || adults < 1 || !Number.isInteger(children) || children < 0) {
    return json({ message: 'Please complete every required field before sending.' }, 400)
  }

  const rows = [
    ['Selected tour', selectedTour],
    ['Full name', fullName],
    ['Email', email],
    ['Phone / WhatsApp', phone],
    ['Country', country],
    ['Preferred date', travelDate],
    ['Dates flexible', clean(body?.flexible) || 'Not specified'],
    ['Adults', adults],
    ['Children', children],
    ["Children's ages", clean(body?.childrenAges)],
    ['Accommodation', clean(body?.accommodationPreference || body?.accommodation)],
    ['Budget per person', clean(body?.budgetPerPerson)],
    ['Estimated group budget', clean(body?.estimatedGroupBudget)],
    ['Submitted', submittedAt],
  ]
  const text = [`New ${companyName} booking request`, '', ...rows.map(([label, value]) => `${label}: ${value || 'Not provided'}`), '', 'Special Requests / Notes:', notes || 'None'].join('\n')
  const html = emailShell('New tour booking request', `${escapeHtml(fullName)} submitted a booking request for ${escapeHtml(selectedTour)}.`, rows, 'Special requests / notes', notes || 'No additional notes provided.')
  return persistAndNotify(env, body, { replyTo: email, subject: `New ${companyName} booking request from ${fullName}`, html, text })
}

export function onRequestGet() {
  return json({ message: 'Method not allowed.' }, 405)
}

async function persistAndNotify(env,body,emailMessage) {
 const url=getEnv(env,['SUPABASE_URL']).replace(/\/$/,'')
 const key=getEnv(env,['SUPABASE_PUBLISHABLE_KEY'])
 if (!url || !key.startsWith('sb_publishable_')) return json({message:'Submission service is not configured.'},503)
 const booking=body.formType==='booking'
 const payload={
  type:booking?'booking':'inquiry', package_id:body.packageId || null,
  tour_package_name:clean(body.selectedTour)||null,full_name:clean(body.fullName),email:clean(body.email).toLowerCase(),phone:clean(body.phone),
  country:clean(body.country)||null, preferred_travel_date:booking?clean(body.travelDate):null,
  date_flexible:booking?body.flexible==='Yes':null, adults:booking?Number(body.adults):null, children:booking?Number(body.children):null,
  children_ages:clean(body.childrenAges)||null, accommodation_preference:clean(body.accommodationPreference||body.accommodation)||null,
  budget_per_person:clean(body.budgetPerPerson)||null,estimated_group_budget:clean(body.estimatedGroupBudget)||null,
  currency:clean(body.currency)||null,travelers:booking?Number(body.adults)+Number(body.children):null,
  message:clean(body.message)||null,special_requests:clean(body.notes)||null,raw_payload:{}
 }
 try {
  const response=await fetch(`${url}/rest/v1/form_submissions`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(payload)})
  if (!response.ok) return json({message:'Your request could not be saved. Please try again.'},502)
 } catch { return json({message:'Unable to reach the submission service. Please try again.'},502) }
 // The request is already saved. Notification failure must not invite duplicate submissions.
 const notification=await sendEmail(env,emailMessage)
 if (!notification.ok) console.warn('Top Cloud submission saved; email notification unavailable.')
 return json({message:'Your request was received successfully.',saved:true})
}
