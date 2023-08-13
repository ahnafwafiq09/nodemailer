// Configuring dotenv files
import dotenv from "dotenv";
dotenv.config();

// Initializing Express App
import express from "express";
const app = express();
app.use(express.json());
app.listen(process.env.PORT, () => {
    console.log(`App started on http://localhost:${process.env.PORT}`);
});

// Nodemailer config
import nodemailer from "nodemailer";
import { promiseHooks } from "v8";
const mail = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

import { readFileSync } from "fs";

mail.verify((err, success) => {
    if (err) {
        console.error(err);
    } else {
        console.log(success);
    }
});

app.route("/").get((_, res) => {
    const html = readFileSync("./static/index.html", "utf-8");
    res.send(html);
});

app.route("/sendmail")
    .get((_, res) => {
        res.redirect("/");
    })
    .post(async (req, res) => {
        const { to, subject, body } = req.body;
        if (!req.body.to) {
            res.status(418).send({
                error: true,
                message: "Provide a valid reciever email",
            });
        }
        if (!req.body.body) {
            res.status(418).send({
                error: true,
                message: "Provide a email body",
            });
        }
        if (!req.body.subject) {
            res.status(418).send({
                error: true,
                message: "Provide a email subject",
            });
        }
        try {
            const promise = await mail.sendMail({
                from: "no-reply@ahnafwafiq.com",
                to: to,
                subject: subject,
                text: body,
            });
            console.log(promise);
        } catch (err) {
            res.status(418).send({
                error: true,
                message: err?.toString(),
            });
        }
        res.status(200).send({
            error: false,
            message: "Your email was sent successfully",
        });
    });
