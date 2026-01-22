// const nodemailer = require("nodemailer");
// const db = require("../config/db.config");

// /* ================= TRANSPORTER ================= */
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /* ================= LOAD TEMPLATE FROM DB ================= */
// const getTemplate = async (templateName) => {
//   const [[template]] = await db.query(
//     "SELECT subject, body FROM email_templates WHERE name = ?",
//     [templateName]
//   );

//   if (!template) {
//     throw new Error("Email template not found");
//   }

//   return template;
// };

// /* ================= REPLACE PLACEHOLDERS ================= */
// const replacePlaceholders = (text, data) => {
//   let result = text;

//   Object.keys(data).forEach((key) => {
//     const regex = new RegExp(`{{${key}}}`, "g");
//     result = result.replace(regex, data[key]);
//   });

//   return result;
// };

// /* ================= SEND EMAIL ================= */
// exports.sendEmail = async ({ to, templateName, data }) => {
//   const template = await getTemplate(templateName);

//   const subject = replacePlaceholders(template.subject, data);
//   const body = replacePlaceholders(template.body, data);

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to,
//     subject,
//     html: body,
//   });
// };

const nodemailer = require("nodemailer");
const db = require("../config/db.config");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getTemplate = async (name) => {
  const [[template]] = await db.query(
    "SELECT subject, body FROM email_templates WHERE name = ?",
    [name]
  );
  if (!template) throw new Error("Email template not found");
  return template;
};

const replace = (text, data) => {
  Object.keys(data).forEach((key) => {
    text = text.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  });
  return text;
};

exports.sendEmail = async ({ to, templateName, data }) => {
  const template = await getTemplate(templateName);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: replace(template.subject, data),
    html: replace(template.body, data),
  });
};
