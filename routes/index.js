var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./post')
var passport = require('passport')
const upload = require('./multer')
const uploadDp = require('./dp')
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */

router.get('/', function(req, res, next) {

    res.render('login', { error: req.flash("error") });
});
router.get('/register', function(req, res, next) {
    res.render('register');
});

router.post('/fileupload', isLoggedIn, uploadDp.single('file'), async function(req, res, next) {
    if (!req.file) {
        return res.status(404).send('file not uploaded');
    }
    const user = await userModel.findOne({ username: req.session.passport.user });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect('/profile')


});

router.post('/upload', isLoggedIn, upload.single('file'), async function(req, res, next) {
    if (!req.file) {

        req.flash('error', 'File not uploaded'); // Add flash message
        return res.redirect('/profile');
    }
    const user = await userModel.findOne({ username: req.session.passport.user });

    const post = await postModel.create({
        posts: req.file.filename,
        postText: req.body.filecaption,
        discription: req.body.discription,
        user: user._id
    });
     user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');

});
router.get('/upload', (req, res, next) => {
        res.render('upload')
    })
    // router.get('/login', function(req, res, next) {
    //     res.render('login')
    // });
router.get('/profile', isLoggedIn, async function(req, res) {
    const user = await userModel.findOne({
        username: req.session.passport.user
    }).populate("posts")
    
    res.render('profile', { user })
})
router.get('/feeds', async function(req, res) {
    

    const feed= await postModel.find().populate('user')
   
    
    
res.render('feeds', { feed })
})

router.post('/register',async function(req, res) {
    var userdata = new userModel({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        posts: [],
        // contact: req.body.contact,
        dob: req.body.dob
    });
    userModel.register(userdata, req.body.password)
        .then(() => {
            passport.authenticate("local")(req, res, function() {
                res.redirect('/profile')
            })
        })
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true
}), function(req, res) {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    })
});

// router.get('/feeds', async(req, res, next) => {
//     const feed = await feedsModel.find()
//     feed.posts.push('helo')
//     await feed.save()

// })


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/")
}


module.exports = router;