const { sendFeedbackEmail } = require("../services/emailService");

let handleFeedbackSubmission = async (req, res) => {
    try {
        const feedbackData = req.body;
        if (
            !feedbackData.name ||
            !feedbackData.email ||
            !feedbackData.category ||
            !feedbackData.subject ||
            !feedbackData.message
        ) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required fields",
            });
        }
        await sendFeedbackEmail(feedbackData);
        return res.status(200).json({
            errCode: 0,
            errMessage: "Feedback sent successfully",
        });
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server: " + error.message,
        });
    }
};

module.exports = {
    handleFeedbackSubmission,
};
