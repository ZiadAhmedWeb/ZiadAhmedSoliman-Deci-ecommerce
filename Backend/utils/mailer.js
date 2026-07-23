const nodemailer = require('nodemailer');

async function sendWelcomeEmail(toEmail) {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"ZeeCrumb" <no-reply@zeecrumb.com>',
      to: toEmail,
      subject: 'Welcome to ZeeCrumb!',
      text: `Thanks for signing up, ${toEmail}! Start shopping now.`,
      html: `<h2>Welcome to ZeeCrumb!</h2><p>Thanks for signing up. Start browsing our products now.</p>`,
    });

    console.log('Welcome email sent:', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
}

module.exports = sendWelcomeEmail;