import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env["EMAIL_HOST"] ?? "smtp.gmail.com",
    port: Number(process.env["EMAIL_PORT"] ?? 587),
    secure: false,
    auth: {
        user: process.env["EMAIL_USER"],
        pass: process.env["EMAIL_PASS"],
    },
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const link = `${process.env["CLIENT_URL"] ?? "http://localhost:5173"}/verify-email?token=${token}`;
    await transporter.sendMail({
        from: process.env["EMAIL_FROM"] ?? "no-reply@bizmart.com",
        to,
        subject: "Verify your BizMart account",
        html: `<p>Click the link below to verify your email:</p>
               <a href="${link}">${link}</a>
               <p>This link expires in 24 hours.</p>`,
    });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
    const link = `${process.env["CLIENT_URL"] ?? "http://localhost:5173"}/reset-password?token=${token}`;
    await transporter.sendMail({
        from: process.env["EMAIL_FROM"] ?? "no-reply@bizmart.com",
        to,
        subject: "Reset your BizMart password",
        html: `<p>Click the link below to reset your password:</p>
               <a href="${link}">${link}</a>
               <p>This link expires in 1 hour.</p>`,
    });
};
