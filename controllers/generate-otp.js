const nodemailer = require('nodemailer');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const send_otp_to_mail=async(email,res)=>{
    try{
        const otp=await generateOTP()
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
          to: email,
          subject: "New Career Request from Glaube Saber Website",
          html: buildCareerEmail(otp),
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
    }catch(error){
        console.log('error:',error);
        
    }
}

// Email template builders
function buildCareerEmail(otp) {
  return `
    <div style="width: 80%; margin: 20px auto; background-color: #f0f0f0; text-align: center; padding-bottom: 6%">
      <img style="padding: 17px; width: 65%;" src="https://www.glaubelogistics.com/img/logo.svg" alt="Glaube Logistics Logo">
      <div style="background-color: #ffffff; width: 80%; margin: 0 auto; border: 1px solid #e3e3e3; border-radius: 5px; font-size: 17px; color: #666; letter-spacing: 1px;">
        <div style="padding: 20px;">
          <h2 style="text-align: center; font-size: 35px; font-weight: 100; color: #777;">Your OTP for Registration</h2>
          <p>Enter this otp while registering to Glaube Saber</p>
          <div style="text-align: left; padding: 30px;">
            <p>OTP : ${otp}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

module.exports={
    generateOTP,
    send_otp_to_mail
}