const nodemailer = require('nodemailer');

const contactus= async(req,res)=>{
    try{
        const {name,email,phone,country,message}=req.body
        const date = new Date().toLocaleDateString('en-GB');
        console.log('user details:',name,email,phone,country,message,date);
        const send_mail=await generateMail(name,email,phone,country,message,date)
        res.redirect('/thankyou')
    }catch(err){
        console.log("error:",err);
    }
}
const generateMail = async (name,email,phone,country,message,date) => {

  let transpoter = nodemailer.createTransport({
    service: "gmail",
    secure: false, 
    requireTLS: true, 
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    replyTo: `${name} <${email}>`,
    subject: "New Career Request from Glaube Saber Website",
    html: buildCareerEmail(name,email,phone,country,message,date),
  };

  console.log("mailoptions:", mailOptions);

  return new Promise((resolve, reject) => {
    transpoter.sendMail(mailOptions, (err, info) => {
      console.log("get into return");
      if (err) {
        console.log("error while generating otp");
        reject(err.message);
      } else {
        console.log("generated otp for registration:", info);
        resolve();
      }
    });
  });
};

// Email template builders
function buildCareerEmail(name,email,phone,country,message, date) {
  return `
    <div style="width: 80%; margin: 20px auto; background-color: #f0f0f0; text-align: center; padding-bottom: 6%">
      <img style="padding: 17px; width: 65%;" src="https://www.glaubelogistics.com/img/logo.svg" alt="Glaube Logistics Logo">
      <div style="background-color: #ffffff; width: 80%; margin: 0 auto; border: 1px solid #e3e3e3; border-radius: 5px; font-size: 17px; color: #666; letter-spacing: 1px;">
        <div style="padding: 20px;">
          <h2 style="text-align: center; font-size: 35px; font-weight: 100; color: #777;">Messaged by,<br>${name}</h2>
          <p>Contact form request details</p>
          <div style="text-align: left; padding: 30px;">
            <p>Date : ${date}</p>
            <p>Name : ${name}</p>
            <p>Mobile : ${phone}</p>
            <p>Country : ${country}</p>
            <p>Email : ${email}</p>
            <p>Message : ${message}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}


module.exports={
    contactus,
    generateMail
}