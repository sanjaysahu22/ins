var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(userModel.authenticate()));
const upload = require('./multer');
const upload2 = require('./multer2');

// Follow button route (currently just a placeholder)
router.post('/followBtn', isLoggedIn, async function(req, res) {

  
  console.log(req.body.id)
  try{

    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    const toFollow= req.body.id; 
    const follower= await userModel.findOne({username:toFollow})
    user.following.push(follower._id)
    await user.save()
    res.redirect("/followers")
  }
  catch(err){
    console.log(err)
    res.redirect('/profile')
  }
  
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.flash('error'));
  res.render('index', { error: req.flash('error') });
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/upload', isLoggedIn, upload.single('filename'), async function(req, res) {
  if (!req.file) {
    return res.status(404).send("no files were added");
  }
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const post = await postModel.create({
    postImg: req.file.filename,
    user: user._id
  });
  user.post.push(post._id);
  await user.save();
  res.render('profile');
  console.log(user.post);
});

router.get('/edit', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render('edit', { user });
});

router.post('/edit_profile', isLoggedIn, upload2.single('profile_pic'), async function(req, res) {
  if (!req.file) {
    return res.status(404).send("cannot update profile");
  }
  const user = await userModel.findOne({
    username: req.session.passport.user
  });

  await userModel.findByIdAndUpdate(user._id, {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
    profile_pic: req.file.filename
  });
  res.send("profile updated");
});

router.get('/followers', isLoggedIn, async function(req, res) {
  const allUser = await userModel.find(
    { username: { $ne: req.session.passport.user } }
  );
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  console.log(req.session.passport.user);

  res.render('followers', { allUser, user });
});

router.get('/home', isLoggedIn, async function(req, res, next) {
  const allUser = await userModel.find({
    username: { $ne: req.session.passport.user }
  });
  res.render('home', { allUser });
});

router.get('/profile', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const posts = await postModel.find({
    user: user._id
  });

  res.render('profile', { user, posts });
});

router.post("/register", function (req, res) {
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
  });

  userModel.register(user, req.body.password).then(function (registereduser) {
    passport.authenticate("local")(req, res, function () {
      console.log("done")
      res.redirect("/home");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("auth failed")
    res.status(401).redirect("/");
  }
}

module.exports = router;
