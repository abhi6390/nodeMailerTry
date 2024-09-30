import { Client, Users } from 'node-appwrite';
import nodemailer from 'nodemailer';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // Appwrite client setup
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const users = new Users(client);

  try {
    const response = await users.list();
    log(`Total users: ${response.total}`);
  } catch(err) {
    error("Could not list users: " + err.message);
  }

  // Nodemailer transporter setup
  const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: 'newtrial1234567@gmail.com', 
      pass: 'ldzizfcmbtejsrkm ' 
    }
  });

  // Send mail function
  function sendMail(to, sub, msg) {
    transporter.sendMail({
      to: to,
      subject: sub,
      html: msg
    }, (err, info) => {
      if (err) {
        error("Error sending email: " + err.message);
      } else {
        log("Email sent: " + info.response);
      }
    });
  }

  // Check the request path and trigger the email
  if (req.path === "/ping") {
    return res.text("Email Sent!");
  }
  
  sendMail('sriharihc733@gmail.com', "Subject", "<p>Hello, this is a test mail.</p>");
  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
