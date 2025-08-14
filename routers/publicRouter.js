// routes/index.js
const express = require('express');
const router = express.Router();
const controller=require("../controllers/contactus")
const signupController=require("../controllers/sign-up")
router.get('/', (req, res) => {
    res.render('home',{ currentPath: req.path });
});
router.get('/service',(req,res)=>{
    res.render('service',{ currentPath: req.path })
})
router.get('/about-us',(req,res)=>{
    res.render('aboutus',{ currentPath: req.path })
})
router.get('/price',(req,res)=>{
    res.render('price',{ currentPath: req.path })
})
router.get('/pricing',(req,res)=>{
    res.render('pricing',{ currentPath: req.path })
})
router.get('/contact-us',(req,res)=>{
    res.render('contact',{ currentPath: req.path })
})
router.get('/thankyou',(req,res)=>{
    res.render('thank-you')
})
router.get('/features',(req,res)=>{
    res.render('features',{ currentPath: req.path })
})
router.get('/error',(req,res)=>{
    res.render('404error',{ currentPath: req.path })
})
router.get('/login',(req,res)=>{
    res.render('login',{ toast: null }
    // res.render('ok',{ toast: { message: 'Welcome to login page!', type: 'success' } }
        // ,{
        //     swal: {
        //         show: true,
        //         type: 'success',
        //         title: 'Success!',
        //         text: 'Form submitted successfully!'
        //     }
        // }
    )
})

router.post('/contactus',controller.contactus)
router.post('/send-otp',signupController.sendOTP)
router.post('/verify-otp',signupController.verifyOTP)
router.post('/signup',signupController.signup)
router.post('/signin',signupController.signin   )
router.get('/forgetPassword',(req,res)=>{
    res.render('forgetPassword',{ toast: null })
})
router.post('/update-password',signupController.updatePassword)
module.exports = router;