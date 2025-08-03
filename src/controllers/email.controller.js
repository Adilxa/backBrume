import MailService from "../services/email.sevice.js";
import prisma from "../../db/db.config.js"

export const SendEmail = async (req, res) => {
    try {
      const {user_id, to,  subject, message} = req.body;

      await MailService.sendActivationMail(user_id,to, subject, message);

      await prisma.email.create({
        data : {
            user_id,
            to,
            subject,
            message
        }
      })
   

      return res.json({
        status: 200,
        message: "Activation email sent successfully!",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        status: 500,
        message: "Failed to send activation email",
      });
    }
};
  
export const getUserEmails = async (req, res) => {
  try {
    const { user_id } = req.params;

    console.log(user_id);

    const userWithEmails = await prisma.user.findUnique({
      where: { id: Number(user_id) },
      include: {
        Emails: {
          select: {
            to:true,
            message:true
          }
        },
      },
    });

    if (!userWithEmails) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      status: 200,
      user: {
        id: userWithEmails.id,
        name: userWithEmails.name,
        email: userWithEmails.email,
      },
      sentEmails: userWithEmails.Emails, 
    });
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch user emails",
    });
  }
};
