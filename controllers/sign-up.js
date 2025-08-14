const nodemailer = require('nodemailer');
const {hashedPass,comparePass}=require('../helper/hashPassword')
const usercollection=require('../models/user')

const signup=async(req,res)=>{
  try{
    const {firstName,lastName,countryCode,phone,email,password}=req.body
    console.log(firstName,lastName,countryCode,phone,email,password);
    const user = await usercollection.findOne({ email });
    console.log('registered user:',user);
    if(user===null){
      const hashed_password = await hashedPass(password);
      const userdata = await usercollection.create({
        firstName,
        lastName,
        email,
        countryCode,
        contactNumber:phone,
        password:hashed_password
      })
      console.log('userdata after db updation:',userdata);
      res.status(201).json({
        success:true,
        toast:{message:'✅ Registration completed successfully!',type:"success"}
      })  
    }else{
     res.status(400).json({
        success:false,
        toast:{message:'⚠️ This email is already registered',type:"error"}
      })  
    }
  }catch(err){
    console.log("error:",err);
    res.status(500).json({
        success: false,
        toast: { message: "⚠️ Something went wrong!", type: "error" }
    })
  }
}

const signin=async(req,res)=>{
  try{
    const {username,password}=req.body
    console.log("login credentials:",username,password);
    const userdata=await usercollection.findOne({email:username})
    console.log('userdata:',userdata);
    if(userdata){
      const password_match = await comparePass(password, userdata.password);
      if(password_match){
        console.log("sign in done");
        
        res.status(200).json({
            success: true,
            toast: { message: "✅ You have successfully logged in. Welcome back!", type: "success" }
        })
      }else{
        console.log("incorrect password");
        res.status(401).json({
            success: false,
            toast: { message: "⚠️ Login failed — incorrect password.", type: "error" }
        })
      }
    }else{
        console.log("correct username");
      res.status(401).json({
        success: false,
        toast: { message: "⚠️ Login failed — the username does not match any account.", type: "error" }
    })
    }
    
  }catch(err){
    console.log("error:",err);
    res.status(500).json({
        success: false,
        toast: { message: "⚠️ Something went wrong!", type: "error" }
    })
  }
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOTP= async(req,res)=>{
    try{
        const email=req.body.email
        const purpose=req.body.purpose 
        console.log('purpose:',purpose);
        if(purpose){
          const user=await usercollection.findOne({email})
          if(!user){
            return res.status(401).json({
                success: false,
                toast: { message: "⚠️ failed — the username does not match any account.", type: "error" }
            })
          }else{
            req.session.email = email;
            console.log('req.session.email:',req.session.email);
          }
        }
        console.log('user details:',email);
        const otp=await generateOTP()
        req.session.otp = otp;
        const send_mail=await generateMail(email,otp)
        res.status(200).json({
            success: true,
            toast: { message: 'OTP have been send successfully!', type: 'success' }
        });
    }catch(err){
        console.log("error:",err);
        res.status(500).json({
            success: false,
            toast: { message: "⚠️ Something went wrong!", type: "error" }
        })
    }
}

const verifyOTP=async(req,res)=>{
    try{
        const otp=req.body.otp
        console.log("otp:",otp,req.session.otp);
        if(req.session.otp!=otp){
            res.status(400).json({
                success:false,
                toast:{message:"⚠️ Please enter the correct OTP!", type: "error"}
            })
        }else{
            res.status(200).json({
                success:true,
                toast:{message:"OTP have been verified successfully!", type: "success"}
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            toast:{message:"⚠️ Something went wrong!",type:"error"}
        }) 
    }
}

const updatePassword=async(req,res)=>{
  try{
    const password=req.body.password
    let email=req.session.email
    console.log('req.session.email:',req.session.email);
    if(!email){
      return res.status(401).json({
          success:false,
          toast:{message:"⚠️ Couldn't find the email! Please refresh the page and redo it",type:"error"}
      }) 
    }
    const user=await usercollection.findOne({email})
    if(user){
      const hashed_password=await hashedPass(password)
      await usercollection.findOneAndUpdate({email},{password:hashed_password})
      res.status(200).json({
          success:true,
          toast:{message:"Password updated Successfully. Please login with updated password.",type:"success"}
      }) 
    }else{
      res.status(401).json({
          success:false,
          toast:{message:"⚠️ Email not found! Please refresh the page.",type:"error"}
      }) 
    }
  }catch(err){
    console.log(err);
    res.status(500).json({
        success:false,
        toast:{message:"⚠️ Something went wrong!",type:"error"}
    }) 
  }
}

const generateMail=(email,otp)=>{
    console.log('email:',email);
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
        //   return reject(err.message);
         resolve({
                success: false,
                message: err.message || "⚠️ Failed to send OTP via email"
            });
        } else {
          console.log("generated otp for registration:", info);
        //   resolve();
        resolve({
                success: true,
                message: "OTP have been sent successfully!"
            });
        }
      });
    });
}

// Email template builders
function buildCareerEmail(otp) {
  return `
    <div style="width: 80%; margin: 20px auto; background-color: #f0f0f0; text-align: center; padding-bottom: 6%">
      <img style="padding: 17px; width: 65%;" src="https://www.glaubelogistics.com/img/logo.svg" alt="Glaube Logistics Logo">
      <div style="background-color: #ffffff; width: 80%; margin: 0 auto; border: 1px solid #e3e3e3; border-radius: 5px; font-size: 17px; color: #666; letter-spacing: 1px;">
        <div style="padding: 20px;">
          <h2 style="text-align: center; font-size: 35px; font-weight: 100; color: #777;">OTP for registration</h2>
          <p>The following is your OTP to validate your email address at Glaube Saber. Enter the code below in order to submit your form:</p>
          <h2>${otp}</h2>
        </div>
      </div>
    </div>
  `;
}


module.exports={
    sendOTP,
    generateMail,
    verifyOTP,
    signup,
    signin,
    updatePassword
}