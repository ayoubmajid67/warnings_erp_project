/**
 * Email Service
 * Sends email notifications using nodemailer with Gmail App Password
 * 
 * SETUP FOR GMAIL WITH 2FA:
 * 1. Go to Google Account > Security > 2-Step Verification
 * 2. At the bottom, click "App passwords"
 * 3. Select "Mail" and "Windows Computer" (or other)
 * 4. Click "Generate" - you'll get a 16-character password
 * 5. Set that password as SMTP_PASS environment variable
 * 
 * Environment Variables Required:
 * - SMTP_USER: Your Gmail address (e.g., youremail@gmail.com)
 * - SMTP_PASS: Your 16-character App Password (NOT your Gmail password)
 */

import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
  enabled: true, // Set to true to enable email sending
  from: process.env.SMTP_USER || 'ERP Warning System <noreply@erp-system.com>',
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.SMTP_USER || '', // Your Gmail address
      pass: process.env.SMTP_PASS || ''  // Your 16-char App Password
    }
  },
  contact: 'ayoub@majjid.com'
};

// Create reusable transporter
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.smtp.host,
      port: EMAIL_CONFIG.smtp.port,
      secure: EMAIL_CONFIG.smtp.secure,
      auth: {
        user: EMAIL_CONFIG.smtp.auth.user,
        pass: EMAIL_CONFIG.smtp.auth.pass
      }
    });
  }
  return transporter;
}

/**
 * Modern email template base styles
 */
const getBaseStyles = () => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #1a1f2e;
    background-color: #f0f4f8;
  }
  .email-wrapper {
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 3px;
    border-radius: 16px;
  }
  .email-container {
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, #1a1f2e 0%, #2d3548 100%);
    padding: 40px 30px;
    text-align: center;
  }
  .logo-container {
    margin-bottom: 20px;
  }
  .logo-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
  .header h1 {
    color: #ffffff;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.5px;
  }
  .header .subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-top: 8px;
  }
  .content {
    padding: 40px 30px;
  }
  .greeting {
    font-size: 18px;
    color: #1a1f2e;
    margin-bottom: 20px;
  }
  .greeting strong {
    color: #667eea;
  }
  .message-box {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 12px;
    padding: 25px;
    margin: 20px 0;
    border-left: 4px solid #667eea;
  }
  .warning-indicator {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 25px 0;
  }
  .warning-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .warning-1 {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
  }
  .warning-2 {
    background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
    color: #9a3412;
    box-shadow: 0 4px 15px rgba(251, 146, 60, 0.3);
  }
  .warning-3 {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }
  .dropped {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  }
  .reason-card {
    background: #ffffff;
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }
  .reason-card .label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-bottom: 8px;
  }
  .reason-card .value {
    font-size: 16px;
    color: #1a1f2e;
    font-weight: 500;
  }
  .alert-box {
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    display: flex;
    align-items: flex-start;
    gap: 15px;
  }
  .alert-warning {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 1px solid #f59e0b;
  }
  .alert-danger {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border: 1px solid #ef4444;
  }
  .alert-icon {
    font-size: 24px;
    flex-shrink: 0;
  }
  .alert-content {
    font-size: 14px;
    color: #1a1f2e;
    font-weight: 500;
  }
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    margin: 30px 0;
  }
  .signature {
    margin-top: 30px;
  }
  .signature p {
    color: #64748b;
    font-size: 14px;
  }
  .signature .team-name {
    color: #1a1f2e;
    font-weight: 600;
    font-size: 16px;
    margin-top: 5px;
  }
  .footer {
    background: #f8fafc;
    padding: 30px;
    text-align: center;
    border-top: 1px solid #e2e8f0;
  }
  .footer-logo {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 15px;
  }
  .footer-text {
    font-size: 12px;
    color: #94a3b8;
    margin-bottom: 15px;
  }
  .contact-link {
    display: inline-block;
    color: #667eea;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
  }
  .contact-link:hover {
    text-decoration: underline;
  }
  .social-links {
    margin-top: 15px;
  }
  .social-links a {
    display: inline-block;
    margin: 0 8px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 12px;
  }
`;

/**
 * Send email using nodemailer
 */
async function sendEmail(to, subject, htmlContent) {
  if (!EMAIL_CONFIG.enabled) {
    console.log('📧 [DEV] Email disabled');
    return { success: true, message: 'Email disabled' };
  }

  if (!EMAIL_CONFIG.smtp.auth.user || !EMAIL_CONFIG.smtp.auth.pass) {
    console.log('📧 [ERROR] SMTP credentials not configured');
    console.log('   Set SMTP_USER and SMTP_PASS environment variables');
    return { success: false, message: 'SMTP credentials not configured' };
  }

  try {
    const transport = getTransporter();
    
    const info = await transport.sendMail({
      from: EMAIL_CONFIG.from,
      to: to,
      subject: subject,
      html: htmlContent
    });

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, message: 'Email sent', messageId: info.messageId };
  } catch (error) {
    console.error('📧 Email error:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Send warning notification email to member
 */
export async function sendWarningEmail(memberEmail, memberName, warningCount, reason, warningId = null) {
  const warningTexts = {
    1: 'First Warning',
    2: 'Second Warning - Final Notice',
    3: 'Final Warning - Account Dropped'
  };

  const subject = `⚠️ ${warningTexts[warningCount] || 'Warning'} - ERP Team`;
  
  // Production URL for warning details
  const productionUrl = 'https://warnings-erp-project-ow30su4gp-ayoubmajid67s-projects.vercel.app';
  const warningLink = warningId ? `${productionUrl}/warnings/${warningId}` : null;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Warning Notification</title>
      <style>
        ${getBaseStyles()}
        .view-details-btn {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
        }
        .view-details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px; background-color: #f0f4f8;">
        <div class="email-wrapper">
          <div class="email-container">
            
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <div class="logo-icon">⚠️</div>
              </div>
              <h1>Warning Notification</h1>
              <p class="subtitle">ERP Team Management System</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              <p class="greeting">Hello <strong>${memberName}</strong>,</p>
              
              <div class="message-box">
                <p>You have received a warning from the ERP Team administration. Please review the details below and take appropriate action to improve.</p>
              </div>
              
              <!-- Warning Badge -->
              <div class="warning-indicator">
                <div class="warning-badge warning-${warningCount}">
                  ⚠️ Warning ${warningCount} of 3
                </div>
              </div>
              
              <!-- Reason Card -->
              <div class="reason-card">
                <div class="label">📋 Reason for Warning</div>
                <div class="value">${reason}</div>
              </div>
              
              ${warningLink ? `
              <!-- View Details Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${warningLink}" class="view-details-btn">
                  👁️ View Warning Details
                </a>
                <p style="color: #64748b; font-size: 13px; margin-top: 10px;">
                  Click the button above to view complete warning information
                </p>
              </div>
              ` : ''}
              
              ${warningCount === 2 ? `
              <!-- Final Notice Alert -->
              <div class="alert-box alert-warning">
                <span class="alert-icon">⚡</span>
                <span class="alert-content">
                  <strong>Final Notice:</strong> This is your second and final warning. 
                  One more warning will result in immediate removal from the team. 
                  Please take immediate corrective action.
                </span>
              </div>
              ` : ''}
              
              ${warningCount >= 3 ? `
              <!-- Dropped Alert -->
              <div class="alert-box alert-danger">
                <span class="alert-icon">❌</span>
                <span class="alert-content">
                  <strong>Account Terminated:</strong> You have been removed from the team 
                  due to reaching the maximum number of warnings (3). Your access has been revoked.
                </span>
              </div>
              ` : ''}
              
              <div class="divider"></div>
              
              <!-- Signature -->
              <div class="signature">
                <p>Best regards,</p>
                <p class="team-name">ERP Team Administration</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-logo">ERP</div>
              <p class="footer-text">
                This is an automated message from the ERP Warning Management System.
              </p>
              <a href="mailto:${EMAIL_CONFIG.contact}" class="contact-link">
                📧 ${EMAIL_CONFIG.contact}
              </a>
              <div class="social-links">
                <span style="color: #94a3b8; font-size: 11px;">
                  © ${new Date().getFullYear()} ERP Team. All rights reserved.
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(memberEmail, subject, htmlContent);
}

/**
 * Send dropout notification email to member
 */
export async function sendDropoutEmail(memberEmail, memberName) {
  const subject = '❌ Team Membership Terminated - ERP Team';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Membership Terminated</title>
      <style>
        ${getBaseStyles()}
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
        }
        .logo-icon {
          background: rgba(255, 255, 255, 0.2);
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px; background-color: #f0f4f8;">
        <div class="email-wrapper" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">
          <div class="email-container">
            
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <div class="logo-icon">❌</div>
              </div>
              <h1>Membership Terminated</h1>
              <p class="subtitle">ERP Team Management System</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              <p class="greeting">Hello <strong>${memberName}</strong>,</p>
              
              <div class="message-box" style="border-left-color: #dc2626;">
                <p>We regret to inform you that your membership with the ERP Team has been <strong>terminated</strong>.</p>
              </div>
              
              <!-- Status Badge -->
              <div class="warning-indicator">
                <div class="warning-badge dropped">
                  ❌ MEMBERSHIP TERMINATED
                </div>
              </div>
              
              <!-- Info Card -->
              <div class="reason-card">
                <div class="label">📋 Reason for Termination</div>
                <div class="value">You have accumulated 3 warnings. As per our team policy, members who receive 3 warnings are automatically removed from the team.</div>
              </div>
              
              <!-- Final Alert -->
              <div class="alert-box alert-danger">
                <span class="alert-icon">🔒</span>
                <span class="alert-content">
                  <strong>Access Revoked:</strong> Your access to all ERP systems and resources has been permanently revoked. 
                  This decision is final and cannot be appealed at this time.
                </span>
              </div>
              
              <div class="divider"></div>
              
              <!-- Signature -->
              <div class="signature">
                <p>Regards,</p>
                <p class="team-name">ERP Team Administration</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-logo">ERP</div>
              <p class="footer-text">
                This is an automated message from the ERP Warning Management System.
              </p>
              <a href="mailto:${EMAIL_CONFIG.contact}" class="contact-link">
                📧 ${EMAIL_CONFIG.contact}
              </a>
              <div class="social-links">
                <span style="color: #94a3b8; font-size: 11px;">
                  © ${new Date().getFullYear()} ERP Team. All rights reserved.
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(memberEmail, subject, htmlContent);
}

/**
 * Send welcome email to new member
 */
export async function sendWelcomeEmail(memberEmail, memberName, temporaryPassword) {
  const subject = '🎉 Welcome to the ERP Team!';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ERP Team</title>
      <style>
        ${getBaseStyles()}
        .header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }
        .credentials-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #22c55e;
          padding: 25px;
          border-radius: 12px;
          margin: 20px 0;
        }
        .credentials-card .label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #166534;
          margin-bottom: 5px;
        }
        .credentials-card .value {
          font-size: 18px;
          font-weight: 700;
          color: #15803d;
          font-family: 'Courier New', monospace;
          background: #ffffff;
          padding: 10px 15px;
          border-radius: 8px;
          margin-top: 5px;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px; background-color: #f0f4f8;">
        <div class="email-wrapper" style="background: linear-gradient(135deg, #059669 0%, #047857 100%);">
          <div class="email-container">
            
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <div class="logo-icon" style="background: rgba(255,255,255,0.2);">🎉</div>
              </div>
              <h1>Welcome to the Team!</h1>
              <p class="subtitle">ERP Team Management System</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              <p class="greeting">Hello <strong>${memberName}</strong>,</p>
              
              <div class="message-box" style="border-left-color: #22c55e;">
                <p>Welcome to the ERP Team! We're excited to have you on board. 
                Your account has been created and you can now access the team management system.</p>
              </div>
              
              <!-- Credentials Card -->
              <div class="credentials-card">
                <div class="label">📧 Your Login Email</div>
                <div class="value">${memberEmail}</div>
                <div style="margin-top: 15px;">
                  <div class="label">🔐 Temporary Password</div>
                  <div class="value">${temporaryPassword}</div>
                </div>
              </div>
              
              <!-- Security Notice -->
              <div class="alert-box" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b;">
                <span class="alert-icon">🔒</span>
                <span class="alert-content">
                  <strong>Security Notice:</strong> Please change your password after your first login 
                  to ensure your account security.
                </span>
              </div>
              
              <div class="divider"></div>
              
              <!-- Signature -->
              <div class="signature">
                <p>Welcome aboard!</p>
                <p class="team-name">ERP Team Administration</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-logo">ERP</div>
              <p class="footer-text">
                This is an automated message from the ERP Warning Management System.
              </p>
              <a href="mailto:${EMAIL_CONFIG.contact}" class="contact-link">
                📧 ${EMAIL_CONFIG.contact}
              </a>
              <div class="social-links">
                <span style="color: #94a3b8; font-size: 11px;">
                  © ${new Date().getFullYear()} ERP Team. All rights reserved.
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(memberEmail, subject, htmlContent);
}

/**
 * Send credentials email to member (DEV ONLY)
 */
export async function sendCredentialsEmail(memberEmail, memberName, password) {
  const subject = '🔐 Your ERP System Credentials';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your ERP Credentials</title>
      <style>
        ${getBaseStyles()}
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .credentials-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #0ea5e9;
          padding: 25px;
          border-radius: 12px;
          margin: 20px 0;
        }
        .credentials-card .label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #075985;
          margin-bottom: 5px;
        }
        .credentials-card .value {
          font-size: 18px;
          font-weight: 700;
          color: #0c4a6e;
          font-family: 'Courier New', monospace;
          background: #ffffff;
          padding: 10px 15px;
          border-radius: 8px;
          margin-top: 5px;
          display: inline-block;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px; background-color: #f0f4f8;">
        <div class="email-wrapper">
          <div class="email-container">
            
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <div class="logo-icon">🔐</div>
              </div>
              <h1>Your System Credentials</h1>
              <p class="subtitle">ERP Team Management System</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              <p class="greeting">Hello <strong>${memberName}</strong>,</p>
              
              <div class="message-box">
                <p>Here are your login credentials for the ERP Team Management System. 
                Please keep this information secure and do not share it with anyone.</p>
              </div>
              
              <!-- Credentials Card -->
              <div class="credentials-card">
                <div class="label">📧 Login Email</div>
                <div class="value">${memberEmail}</div>
                <div style="margin-top: 15px;">
                  <div class="label">🔐 Password</div>
                  <div class="value">${password}</div>
                </div>
              </div>
              
              <!-- Security Notice -->
              <div class="alert-box alert-warning">
                <span class="alert-icon">🔒</span>
                <span class="alert-content">
                  <strong>Security Notice:</strong> This is a development environment. 
                  Please change your password after your first login to ensure account security.
                </span>
              </div>
              
              <div class="divider"></div>
              
              <!-- Signature -->
              <div class="signature">
                <p>Best regards,</p>
                <p class="team-name">ERP Team Administration</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-logo">ERP</div>
              <p class="footer-text">
                This is an automated message from the ERP Warning Management System.
              </p>
              <a href="mailto:${EMAIL_CONFIG.contact}" class="contact-link">
                📧 ${EMAIL_CONFIG.contact}
              </a>
              <div class="social-links">
                <span style="color: #94a3b8; font-size: 11px;">
                  © ${new Date().getFullYear()} ERP Team. All rights reserved.
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(memberEmail, subject, htmlContent);
}
