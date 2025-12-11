const EnumTemplatesHtml = {
    TEMPLATE_HTML_RECOVERY_PASSWORD: `
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
        <p>Your verification code</p>
        <h2 style='color: #DB2777;'>[code]</h2>
        <p>The verification code will be valid for [verificationExpireMins] minutes. Please do not share this code with anyone</p>
        <p style='font-size: 12px; color: #888;'>This is an automated message. If you did not request this, please ignore it and do not reply.</p>
        <hr style='margin: 30px 0;'>
        <p style='font-size: 12px; color: #888;'>Single Team</p>
    </div>
    `
};

module.exports = EnumTemplatesHtml;