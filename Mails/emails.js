import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailsTemplate.js";
import { transporter } from "./nodemailer.config.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { getSubscriptionTemplate, getNewPostTemplate } from './emailsTemplate.js';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base64 encoded small logo for emails - this avoids file path issues in production
// This is a placeholder base64 string - replace with your actual logo encoded in base64
const logoBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAFEklEQVR4nO2dW4hVVRjHf2fGvJCXMkRLpYfwQWnUCkqyh4pMKoIIegh6CXzpqcfo0l0qoqKXLg9FZVRgFBSZYFAQZTUYWmkXw7QaL2NPa/rPw5ozs2bP2efss/e39nfW+sEwM+ec/a3vv/531l7nrL2XMQzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMIzKmQS8BvwC/AuMAr8CrwLnOszVFJwLfAGMkSyHgRXOsjYAFwN7SRdj3F5xljnnnA/sI1uMcfsLmOcqeZ65GNhPvhjj9jdwiaPcuWQqcID+xBi3g8A0N0fIF1OBg/QvxrgdAqa7OEiOmEHvV1VZdgSY6eBYuWAWcJjBxBi3I8DswR8tH8wFjjK4GON2DJg3+OPZZwHFPjdkiTFuJ4BFAz6jeeYDxyl2sGliQPEtbdmAz2maBRSXtUUPNEuMcTsJLB7gec2yGDhFsQNNE2PcTlG8GjQSWEpxDil6kGlijNsYcFmfz22OZUCHYgeZJca4dYDlfTy7KS6n+CJX9ADTxBi3DvkWZAXFDjBNjHHrkL+rrMsp3hJUNHmaGOO2qsczm2AFxfcURZOniTFmq3s4txlWU3z5KJo4S4wxW9PDuc2whuJbiaKJs8QYszXdH9sOV1A8QdHEWWKM2dVdntsM11D8TFE0cZYYY3Ztt+c2w3UUP9gVTZwlxphd3+W5zXADxS+RRRNniTFmN3Z5bjPcRPGrddHEWWKM2c1dnNkUt1D8z6Jo4iwxxmx9F2c2xW0UP9wVTZwlxpjdnvG85riD4hf8oomzxBizOzOe1xx3UfwGo2jiLDHG7O6M5zXHPRS/UymaOEuMMbs343nNcR/F79WLJs4SY8zuT39Uk9xP8T8gRRNniTFmD6Q8p0keovjfraKJs8QYs4dTntMkj1D8H7aiifu1Jz1/3zxK8b+URRPnbU96/r55jOJ/a4smzpJizB5PeU6TPE7xP/5FE2dJMWZPpDynSZ6k+KOEoomzpBizp1Ke0yRPU/xxTdHEWVKM2TMpz2mSZyl+QFg0cZYUY/ZcynOa5HmKP1Qtmjj0KcWYvZDynCZ5keIvWIomDn1KMWYvpTynSV6m+BvnoomzpBizV1Ke0ySvUPzVQNHEWVKM2aspz2mS1yj+7qVo4iwpxuz1lOc0yRsUf0FTNHGWFBPtTfKzNEeANwf4/JuAqwb4/K55i/RXyJskv0LeHuDzm+Qdsr9C3htg/qZ4l+xXyPsDzN8U75P9CvlggPmb4kOyXyEfDTB/U3xM9ivkkwHmb4pPyX6FfDbA/E3xOdmvkC8GmL8pviT7FfLVAPM3xddkv0K+GWD+pviW7FfI9wPM3xQ/kP0K+XGA+ZviJ7JfIT8PMH9T/EL2K+TXAeZvit/IfoX8McD8TfE72a+QPweYvyn+IvsV8vcA8zfFP2S/Qo4OMH9THCf7FXJigPmbYpTsV8ipAeZvitNkv0LODjB/U4yR/Qrp9Lj/JulQ7hXS6XH/TdKh3Cuk0+P+m6RDuVdIp8f9N0mHcq+QTo/7b5IO5V4hnR7332Rj9CvGmG10kDc3jNGfGGO2yUXYvDBGf2KM2WYXYfPCGP2JMWZbXITNC2P0J8aYbXURNi+M0Z8YY7bNRdi8MEZ/YozZdhdh88IY/YkxZjtchM0LY/QnxpjtdBE2L4zRnxhjtstF2LwwRn9ijNluF2HzwhiDizFme1yEzQtjDC7GmO11ETYvjDG4GGO2z0VYwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzCMnPEfNhXJUt0XK+IAAAAASUVORK5CYII=';

// Define mailOptions here
const mailOptions = {
  from: process.env.GMAIL_USER, // Sender address
  // 'to', 'subject', and 'html' will be defined for each email type
};

export const sendVerificationEmail = async (email, code, name) => {
  const mailOptions = {
    from: `"InsightSphere" <${process.env.GMAIL_USER} >`,
    to: email,
    subject: "Email Verification Code",
    html: VERIFICATION_EMAIL_TEMPLATE(code, name),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Failed to send verification email.");
  }
};

export const sendWelcomeEmail = async (email, name="User") => {
  const mailOptions = {
    from: `"InsightSphere" <${process.env.GMAIL_USER} >`,
    to: email,
    subject: "Welcome to InsightSphere",
    html: WELCOME_EMAIL_TEMPLATE(name),
    attachments: [
      {
        filename: "logo.png",
        content: logoBase64,
        encoding: 'base64',
        cid: "logo", // Content ID referenced in the HTML
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Failed to send welcome email.");
  }
};


export const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: `"InsightSphere" <${process.env.GMAIL_USER} >`,
    to: email,
    subject: "Password Reset Request",
    html: PASSWORD_RESET_REQUEST_TEMPLATE(resetLink),
    attachments: [
      {
        filename: "logo.png",
        content: logoBase64,
        encoding: 'base64',
        cid: "logo", // Content ID referenced in the HTML
      },
    ],
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Failed to send password reset email.");
  }
}


export const sendResetSuccessEmail = async (email, name= "User") => {
  const mailOptions = {
    from: `"InsightSphere" <${process.env.GMAIL_USER} >`,
    to: email,
    subject: "Password Reset Success",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE(name),
    attachments: [
      {
        filename: "logo.png",
        content: logoBase64,
        encoding: 'base64',
        cid: "logo", // Content ID referenced in the HTML
      },
    ],
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Failed to send reset success email.");
  }
}

// Function to send a "thank you for subscribing" email
export const sendSubscriptionEmail = async (userEmail) => {
  try {
    await transporter.sendMail({
      ...mailOptions,
      to: userEmail,
      subject: 'Subscription Confirmation',
      html: getSubscriptionTemplate(),
    });
  } catch (error) {
    console.error('Error sending subscription email:', error);
  }
};

// Function to send a "new post" notification to a list of subscribers
export const sendNewPostEmail = async (recipientEmails, post) => {
  if (!recipientEmails || recipientEmails.length === 0) {
    return;
  }
  
  try {
    // Use BCC to send to all subscribers without revealing their emails to each other
    await transporter.sendMail({
      ...mailOptions,
      to: process.env.GMAIL_USER, // A dummy "to" address
      bcc: recipientEmails,
      subject: `New Post: ${post.title}`,
      html: getNewPostTemplate(post),
    });
    console.log(`New post email sent to ${recipientEmails.length} subscribers.`);
  } catch (error) {
    console.error('Error sending new post email:', error);
  }
};