// routes/index.js
const express = require('express');
const router = express.Router();
const controller=require("../controllers/contactus")
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
router.post('/contactus',controller.contactus)
router.get('/thankyou',(req,res)=>{
    res.render('thank-you')
})
router.get('/features',(req,res)=>{
    res.render('features',{ currentPath: req.path })
})
router.get('/login',(req,res)=>{
    res.render('login',{ currentPath: req.path })
})

module.exports = router;