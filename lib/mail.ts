import {Resend} from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string,
) => {
    await resend.emails.send({
        from: "info@pankajk.in",
        to:email,
        subject: "Your 2FA code",
        html: `<p>Your 2FA code here:<span> ${token}<span/></p>`
    })
}

export const sendPasswordResetEmail = async (
    email: string,
    token: string,

) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;
    await resend.emails.send({
        from: "info@pankajk.in",
        to:email,
        subject: "Reset your password",
        html: `<p>Click<button><a href="${resetLink}">here<a/></button> to reset password.</p>`
    })
}

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`


await resend.emails.send({
    from: "info@pankajk.in",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <button><a href="${confirmLink}">here<a/></button> to confirm email.</p>`
})
}