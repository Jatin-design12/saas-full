// Native fetch is built into Node 18+

const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '919221374614519';
const WHATSAPP_CLOUD_ACCESS_TOKEN = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN || 'EAAR2KCxuOHEBQbIZAOeP4DlVBswJZAGCYlVvMrZCtytW4tkv3mbWLu8z7qZA2Y5AJBSZCR1PcAiZBUESMlAa5ZBFhpaqgAg7FryJiVVxEtssmZBOZAECEGxdIUwTVfB0jvhZAcHJhnakzRKOi0eZBsAJURwpfeVACZCWYrFFw4k1CgsObC8FW4K6JLlgh4Tc91rrJQZDZD';
const WHATSAPP_GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || 'v21.0';

async function sendWhatsAppReceipt({ mobile, name, invoice_no, invoice_date, plan, amount }) {
  if (!mobile) return { status: 'skipped', message: 'No mobile number provided' };
  
  let cleanMobile = mobile.replace(/\D/g, '');
  if (cleanMobile.length === 10) cleanMobile = '91' + cleanMobile;

  const url = `https://graph.facebook.com/${WHATSAPP_GRAPH_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
  
  const payload = {
    messaging_product: 'whatsapp',
    to: cleanMobile,
    type: 'template',
    template: {
      name: process.env.WHATSAPP_TEMPLATE_NAME || 'rider_payment_receipt',
      language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: name || 'Rider' },
            { type: 'text', text: invoice_no || `EVG-${Date.now().toString().slice(-6)}` },
            { type: 'text', text: invoice_date || new Date().toLocaleDateString('en-IN') },
            { type: 'text', text: plan || 'EV Rental Plan' },
            { type: 'text', text: `₹${amount}` }
          ]
        }
      ]
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_CLOUD_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log('WhatsApp API response:', result);
    return { status: 'success', data: result };
  } catch (err) {
    console.error('WhatsApp API error:', err.message);
    return { status: 'error', message: err.message };
  }
}

module.exports = { sendWhatsAppReceipt };
