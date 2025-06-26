import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Konfigurasi OAuth2 Google
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
});

// Buat transporter Nodemailer dengan OAuth2
const createTransporter = async () => {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_FROM,
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
      accessToken: accessToken.token
    }
  });
};

// Fungsi untuk mengirim email asset
export const sendAssetEmail = async (toEmail, productName, downloadUrl, invoiceId) => {
  try {
    const transporter = await createTransporter();

    // Baca template email
    const templatePath = path.join(process.cwd(), 'templates', 'asset-email.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholder dengan data aktual
    emailTemplate = emailTemplate
      .replace(/{{PRODUCT_NAME}}/g, productName)
      .replace(/{{DOWNLOAD_URL}}/g, downloadUrl)
      .replace(/{{INVOICE_ID}}/g, invoiceId)
      .replace(/{{SUPPORT_EMAIL}}/g, process.env.SUPPORT_EMAIL)
      .replace(/{{APP_NAME}}/g, process.env.APP_NAME || 'Asset Design Store');

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || 'Asset Design Store'}" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `Your Design Asset: ${productName}`,
      html: emailTemplate,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'images', 'logo.png'),
          cid: 'logo'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending asset email:', error);
    throw error;
  }
};

// Fungsi untuk mengirim email reset password
export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  try {
    const transporter = await createTransporter();

    // Baca template email
    const templatePath = path.join(process.cwd(), 'templates', 'reset-password.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholder dengan data aktual
    emailTemplate = emailTemplate
      .replace(/{{RESET_URL}}/g, resetUrl)
      .replace(/{{EXPIRY_TIME}}/g, '1 hour')
      .replace(/{{SUPPORT_EMAIL}}/g, process.env.SUPPORT_EMAIL)
      .replace(/{{APP_NAME}}/g, process.env.APP_NAME || 'Asset Design Store');

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || 'Asset Design Store'}" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: 'Password Reset Request',
      html: emailTemplate,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'images', 'logo.png'),
          cid: 'logo'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Fungsi untuk mengirim email notifikasi order
export const sendOrderConfirmationEmail = async (toEmail, orderDetails) => {
  try {
    const transporter = await createTransporter();

    // Baca template email
    const templatePath = path.join(process.cwd(), 'templates', 'order-confirmation.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    // Format items untuk ditampilkan di email
    const itemsList = orderDetails.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</td>
        <td>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.subtotal)}</td>
      </tr>
    `).join('');

    // Replace placeholder dengan data aktual
    emailTemplate = emailTemplate
      .replace(/{{ORDER_NUMBER}}/g, orderDetails.orderNumber)
      .replace(/{{ORDER_DATE}}/g, new Date(orderDetails.createdAt).toLocaleDateString())
      .replace(/{{ITEMS_LIST}}/g, itemsList)
      .replace(/{{TOTAL_AMOUNT}}/g, new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(orderDetails.totalAmount))
      .replace(/{{SUPPORT_EMAIL}}/g, process.env.SUPPORT_EMAIL)
      .replace(/{{APP_NAME}}/g, process.env.APP_NAME || 'Asset Design Store');

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || 'Asset Design Store'}" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `Order Confirmation: ${orderDetails.orderNumber}`,
      html: emailTemplate,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'images', 'logo.png'),
          cid: 'logo'
        },
        {
          filename: 'invoice.pdf',
          content: orderDetails.invoicePDF // Asumsi invoicePDF adalah buffer
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};