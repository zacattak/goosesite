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

app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or your SMTP provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.CONTRACTOR_EMAIL,
        subject: `New Message from ${name}`,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Message sent successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending message');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));