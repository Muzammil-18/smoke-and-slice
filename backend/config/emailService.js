const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      family: 4
    });
  }
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal_test@ethereal.email',
      pass: 'test',
    },
  });
};

const buildInvoiceHTML = (order) => {
  const itemRows = order.orderItems.map((item) => {
    const extras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];
    const sizeHTML = item.selectedSize ? `<span style="font-size:11px;color:#FF3838;margin-left:4px;">(${item.selectedSize.name})</span>` : '';
    
    const extrasHTML = extras.length > 0
      ? `<div style="font-size:12px;color:#888;margin-top:4px;">
          ${extras.map(e => `+ ${e.name}`).join('<br/>')}
        </div>`
      : '';

    return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;">
          <div style="font-weight:600;color:#fff;">${item.menuItem ? item.menuItem.name : 'Item'} ${sizeHTML}</div>
          ${extrasHTML}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;text-align:center;color:#aaa;">x${item.quantity}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;text-align:right;color:#fff;font-weight:600;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Order Confirmation - Smoke &amp; Slice</title>
  </head>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Outfit',Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:24px;">

      <div style="text-align:center;padding:32px 0 24px;">
        <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:2px;">
          🔥 SMOKE <span style="color:#FF3838">&amp;</span> SLICE
        </div>
        <div style="font-size:12px;color:#666;margin-top:4px;letter-spacing:3px;">ORDER CONFIRMATION</div>
      </div>

      <div style="background:#1c1c1e;border:1px solid #2a2a2a;border-radius:16px;padding:28px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #2a2a2a;">
          <div>
            <div style="font-size:20px;font-weight:800;color:#fff;">Order Placed! 🎉</div>
            <div style="font-size:13px;color:#888;margin-top:4px;">Invoice #${order.id}</div>
          </div>
          <div style="background:#FF3838;color:#fff;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;">${order.status}</div>
        </div>

        <div style="margin-bottom:20px;">
          <div style="font-size:11px;font-weight:700;color:#FF3838;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Delivery Details</div>
          <div style="font-size:13px;color:#ccc;line-height:2;">
            <strong style="color:#fff;">Recipient:</strong> ${order.name}<br/>
            <strong style="color:#fff;">Email:</strong> ${order.email}<br/>
            <strong style="color:#fff;">Phone:</strong> ${order.phone}<br/>
            <strong style="color:#fff;">Address:</strong> ${order.address}, ${order.city}<br/>
            ${order.specialInstructions ? `<strong style="color:#fff;">Instructions:</strong> ${order.specialInstructions}` : ''}
          </div>
        </div>

        <div>
          <div style="font-size:11px;font-weight:700;color:#FF3838;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Order Items</div>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#111;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;">
                <th style="padding:10px 16px;text-align:left;">Item</th>
                <th style="padding:10px 16px;text-align:center;">Qty</th>
                <th style="padding:10px 16px;text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody style="font-size:13px;">
              ${itemRows}
            </tbody>
          </table>
        </div>

        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #2a2a2a;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#888;margin-bottom:8px;">
            <span>Subtotal</span><span style="color:#fff;">$${order.total.toFixed(2)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#888;margin-bottom:8px;">
            <span>Sales Tax (10%)</span><span style="color:#fff;">$${order.tax.toFixed(2)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#888;margin-bottom:16px;">
            <span>Delivery Fee</span><span style="color:#fff;">$${order.deliveryCharge.toFixed(2)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:800;border-top:1px solid #2a2a2a;padding-top:14px;">
            <span style="color:#fff;">Grand Total</span>
            <span style="color:#FF3838;">$${order.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:12px;color:#444;">© ${new Date().getFullYear()} Smoke &amp; Slice. All rights reserved.</div>
      </div>
    </div>
  </body>
  </html>
  `;
};

const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = createTransporter();
    const htmlContent = buildInvoiceHTML(order);

    const mailOptions = {
      from: `"Smoke & Slice" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `🔥 Order Confirmed! Invoice #${order.id} - Smoke & Slice`,
      html: htmlContent,
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent: ${info.messageId}`);
  } catch (error) {
    console.error('Email Error:', error.message);
  }
};

module.exports = { sendOrderConfirmationEmail };