// server.js
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (your HTML, CSS)
app.use(express.static('public'));

// app.post('/contact', async (req, res) => {
//     const { name, email, message } = req.body;

//     const transporter = nodemailer.createTransport({
//         service: 'Gmail', // or your SMTP provider
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     const mailOptions = {
//         from: email,
//         to: process.env.CONTRACTOR_EMAIL,
//         subject: `New Message from ${name}`,
//         text: message,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.send('Message sent successfully!');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error sending message');
//     }
// });

app.post('/contact', async (req, res) => {
    const { name, message } = req.body;  // Changed: removed 'email' since form doesn't have it

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Missing email credentials in .env file');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,  // Changed: use your email as sender
        to: process.env.CONTRACTOR_EMAIL,
        subject: `New Message from ${name}`,
        text: `From: ${name}\n\n${message}`,  // Changed: added formatting
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent successfully!' });  // Changed: send JSON
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending message' });  // Changed: send JSON
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));