import nodemailer from "nodemailer"
export const transport=nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
})
const sendEmail=async(to,subject,text)=>{
    try {
        const mailOption={
            from:process.env.EMAIL_USER,
            to:to,
            subject:subject,
            text:text
        }
        const info=await transport.sendMail(mailOption)
        console.log("Email sent successfully:",info.response)
        return info

    } catch (error) {
        console.error("Error sending email:",error)
        throw error
    }
}
export default sendEmail