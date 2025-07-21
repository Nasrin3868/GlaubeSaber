const nodemailer = require('nodemailer');

const contactus= async(req,res)=>{
    try{
        const user=req.body
        console.log('user details:',user);
        const send_mail=await generateMail(user.email)
        res.redirect('/thankyou')
    }catch(err){
        console.log("error:",err);
        
    }
}
const generateMail = async (email) => {

  let transpoter = nodemailer.createTransport({
    service: "gmail",
    secure: false, 
    requireTLS: true, 
    auth: {
      user: 'abc@gmail.com',
      pass: '**** **** **** ****',
    },
  });

  const mailOptions = {
    from: process.env.nodemailer_email,
    to: email,
    subject: "Customer contact imformation",
    text: `Conatct info from the contact us form: wgdehjbej`,
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


module.exports={
    contactus,
    generateMail
}