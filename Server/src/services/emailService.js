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
module.exports = {
    sendFeedbackEmail: sendFeedbackEmail,
};
