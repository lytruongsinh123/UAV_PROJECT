require("dotenv").config();
const nodemailer = require("nodemailer");
// feedbackData.name
// feedbackData.email
// feedbackData.category
// feedbackData.subject
// feedbackData.message
// feedbackData.language
let sendFeedbackEmail = async (feedbackData) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    console.log("feedbackData:", feedbackData);
    try {
        await transporter.verify();
        console.log("Email transporter is ready to send emails.");
    } catch (error) {
        console.error("Email transporter is not configured correctly.", error);
        throw new Error("Email transporter configuration failed.");
    }

    await transporter.sendMail({
        from: `"UAV Feedback Bot" <${process.env.EMAIL_APP}>`,
        to: process.env.EMAIL_APP,
        replyTo: feedbackData.email,
        subject: getSubject(feedbackData),
        html: getBodyHTML(feedbackData),
    });
};

let getSubject = (feedbackData) => {
    let result = "";
    if (feedbackData.language === "vi") {
        result = "Thông báo từ hệ thống UAV: " + feedbackData.subject;
    }
    if (feedbackData.language === "en") {
        result = "Notification from UAV system: " + feedbackData.subject;
    }
    return result;
};
let getBodyHTML = (feedbackData) => {
    let result = "";
    if (feedbackData.language === "vi") {
        result = `
        <h3>Thông báo từ hệ thống UAV</h3>
        <p><strong>Tên:</strong> ${feedbackData.name}</p>
        <p><strong>Email:</strong> ${feedbackData.email}</p>
        <p><strong>Danh mục:</strong> ${feedbackData.category}</p>
        <p><strong>Chủ đề:</strong> ${feedbackData.subject}</p>
        <p><strong>Nội dung:</strong> ${feedbackData.message}</p>
        `;
    }
    if (feedbackData.language === "en") {
        result = `
        <h3>Notification from UAV system</h3>
        <p><strong>Name:</strong> ${feedbackData.name}</p>
        <p><strong>Email:</strong> ${feedbackData.email}</p>
        <p><strong>Category:</strong> ${feedbackData.category}</p>
        <p><strong>Subject:</strong> ${feedbackData.subject}</p>
        <p><strong>Message:</strong> ${feedbackData.message}</p>
        `;
    }
    return result;
};
let changePasswordEmail = async (userEmail, resetToken) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    try {
        await transporter.verify();
    } catch (error) {
        console.error("Email transporter is not configured correctly.", error);
        throw new Error("Email transporter configuration failed.");
    }

    await transporter.sendMail({
        from: `"UAV System" <${process.env.EMAIL_APP}>`,
        to: userEmail,
        subject: "Password Change Request",
        html: `
          <div style="max-width:480px;margin:40px auto;padding:32px 24px;background:linear-gradient(135deg,#2d225a 0%,#1a1333 100%);border-radius:16px;box-shadow:0 8px 32px 0 rgba(31,38,135,0.25),0 2px 16px rgba(0,0,0,0.15);color:#fff;font-family:'Segoe UI',Arial,sans-serif;">
            <h2 style="color:#3fa7ff;text-align:center;margin-bottom:24px;">Reset Your Password</h2>
            <p style="font-size:1.05rem;margin-bottom:24px;text-align:center;">
              We received a request to reset your password.<br>
              Click the button below to set a new password. This link will expire in 1 hour.
            </p>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${process.env.URL_REACT}/reset-password?resetToken=${resetToken}"
                 style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#3fa7ff 0%,#a259ff 100%);color:#fff;border-radius:8px;font-weight:600;text-decoration:none;font-size:1.1rem;box-shadow:0 2px 8px 0 #3fa7ff22;">
                Change Password
              </a>
            </div>
            <p style="font-size:0.95rem;text-align:center;color:#bbb;">
              If you did not request a password reset, please ignore this email.
            </p>
          </div>
        `,
    });
};

module.exports = {
    sendFeedbackEmail: sendFeedbackEmail,
    changePasswordEmail: changePasswordEmail,
};
