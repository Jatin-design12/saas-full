// WhatsApp Cloud API Utility for Sending Payment Receipts

const getEnv = (key, fallback = '') => process.env[key] || fallback;

/**
 * Send WhatsApp payment receipt to rider
 * Supports both signatures:
 *   sendWhatsAppReceipt({ mobile, name, invoice_no, invoice_date, plan, amount, receipt_url })
 *   sendWhatsAppReceipt(mobile, { name, invoice_no, invoice_date, plan, amount, receipt_url })
 */
async function sendWhatsAppReceipt(firstArg, secondArg = {}) {
  let opts = {};
  if (typeof firstArg === 'string') {
    opts = { mobile: firstArg, ...secondArg };
  } else if (firstArg && typeof firstArg === 'object') {
    opts = { ...firstArg, ...secondArg };
  }

  const {
    mobile,
    name = 'Rider',
    invoice_no,
    invoice_date,
    plan = 'EV Rental Plan',
    amount = '0',
    receipt_url
  } = opts;

  if (!mobile) {
    console.warn('[WhatsApp] Skipped receipt: No mobile number provided');
    return { status: 'skipped', message: 'No mobile number provided' };
  }

  const phoneId = getEnv('WHATSAPP_PHONE_NUMBER_ID', '919221374614519');
  const token = getEnv('WHATSAPP_CLOUD_ACCESS_TOKEN');
  const version = getEnv('WHATSAPP_GRAPH_VERSION', 'v21.0').replace(/^v?/, 'v');
  const templateName = getEnv('WHATSAPP_TEMPLATE_NAME', 'rider_payment_receipt');
  const lang = getEnv('WHATSAPP_TEMPLATE_LANGUAGE', 'en');
  const dateFormat = getEnv('WHATSAPP_TEMPLATE_INVOICE_DATE_FORMAT', 'DD/MM/YYYY');

  if (!token) {
    console.warn('[WhatsApp] WHATSAPP_CLOUD_ACCESS_TOKEN not set, skipping API call');
    return { status: 'skipped', message: 'Access token not configured' };
  }

  // Format mobile to international format without plus (e.g. 919876543210)
  let cleanMobile = String(mobile).replace(/\D/g, '');
  if (cleanMobile.length === 10) {
    cleanMobile = '91' + cleanMobile;
  }

  // Format date
  let formattedDate = invoice_date;
  if (!formattedDate) {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    formattedDate = dateFormat === 'DD/MM/YYYY' ? `${dd}/${mm}/${yyyy}` : `${yyyy}-${mm}-${dd}`;
  }

  // Clean amount
  const cleanAmount = typeof amount === 'number' ? amount.toFixed(2) : String(amount).replace(/[^0-9.]/g, '');
  const displayAmount = `₹${cleanAmount || '0.00'}`;
  const displayInvNo = invoice_no || `EVG-${Date.now().toString().slice(-6)}`;

  const bodyComponents = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: String(name || 'Rider') },
        { type: 'text', text: String(displayInvNo) },
        { type: 'text', text: String(formattedDate) },
        { type: 'text', text: String(plan || 'EV Rental Plan') },
        { type: 'text', text: String(displayAmount) }
      ]
    }
  ];

  // If template has dynamic URL button configured
  if (receipt_url && getEnv('WHATSAPP_TEMPLATE_URL_BUTTON_INDEX')) {
    bodyComponents.push({
      type: 'button',
      sub_type: 'url',
      index: getEnv('WHATSAPP_TEMPLATE_URL_BUTTON_INDEX', '0'),
      parameters: [
        { type: 'text', text: receipt_url }
      ]
    });
  }

  const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: cleanMobile,
    type: 'template',
    template: {
      name: templateName,
      language: { code: lang },
      components: bodyComponents
    }
  };

  try {
    console.log(`[WhatsApp] Sending payment receipt to ${cleanMobile} via template "${templateName}"...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('[WhatsApp] Meta API error:', result);
      return { status: 'error', error: result };
    }
    console.log('[WhatsApp] Receipt sent successfully! Meta Message ID:', result?.messages?.[0]?.id);
    return { status: 'success', data: result };
  } catch (err) {
    console.error('[WhatsApp] Send error:', err.message);
    return { status: 'error', message: err.message };
  }
}

module.exports = { sendWhatsAppReceipt };

