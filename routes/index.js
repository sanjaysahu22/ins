var express = require('express');
var router = express.Router();
const followerModel = require('./followers');
const followingModel = require('./following');
const userModel = require('./users');
const postModel = require('./post');
const localStrategy = require('passport-local');
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));
const upload = require('./multer');
const upload2 = require('./multer2');









// router.post('/followBtn', async function (req, res) {
//   console.log("dd")
//   try {
//     console.log("inside")
//       const allUser = await userModel.find();
//       const user = await  userModel.findOne({
//         username:"s"
//       });

//       allUser.forEach(async (u)=>{
          
//         if(u.name == req.body.name){
//           if(u.followers.length >0){
//             u.followers.forEach(async (id)=>{
//               if(id  == user._id)
//                 {
//                   console.log("bhot andar gush gaya")
//                   user.following.pop(id);
//                 await  user.save();
//                   u.followers.pop(user._id);
//                 await  u.save();
//                 res.send('unfollow ho gaya'); 
//                 }
//                 else{
//                   u.followers.push(user._id);
//             await  u.save();
//             user.following.push(req.body.id);
//             await user.save(); 
//                  res.send('follow ho gya');
//                 }
//             })
//           }
//           else{
//             u.followers.push(user._id);
//             await  u.save();
//             user.following.push(req.body.id);
//             await user.save();
//             res.send('follow ho gya');

//           }
//         }
//       })

//   } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//   }
// });




router.post('/followBtn' ,isLoggedIn,async function (req, res) {
  console.log(req.body.id);
  try {
    const user = await userModel.findOne({ name: "d" });
    const userclient = await userModel.findOne({ username: req.session.passport.user});
    console.log(req.session.passport.user);

   
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});









/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.flash('error'));
  res.render('index' ,{ error :req.flash('error')});
  console.log(error);
});

router.get('/register', function(req,res){
  res.render('register');
});

router.post('/upload' ,isLoggedIn , upload.single('filename') , async  function(req , res){
  if(!req.file){
    return res.status(404).send("no files were added");}
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  const post = await postModel.create({
    postImg:req.file.filename,
    user:user._id
  })
user.post.push(post._id);
 await user.save();
 res.render('profile');
 console.log(user.post);
})


router.get('/edit' ,isLoggedIn ,function(req ,res ){
  const user =  userModel.findOne({
    username:req.session.passport.user
  })
  res.render('edit' , {user});

})
router.post('/edit_profile' ,isLoggedIn , upload2.single('profile_pic') ,async function(req , res){
  if(!req.file){
    return res.status(404).send("can not update porfile");
  }
   const user = await userModel.findOne({
    username:req.session.passport.user
  })

 await  userModel.findByIdAndUpdate(user._id , {
 
    username:req.body.username ,
    name:req.body.name,
    email:req.body.email , 
    bio:req.body.bio,
    profile_pic:req.file.profile_pic


  })
  res.send("profile updater");

})
router.get('/followers', isLoggedIn,async function(req,res){
 
   const allUser = await userModel.find(
   { username: {$ne: req.session.passport.user}}
   );
   const user =  await userModel.findOne({
    username:req.session.passport.user
  });
  console.log(req.session.passport.user);

   
  

  res.render('followers',{allUser ,user});
})


// router.post("/followBtn",(req,res)=>{
//   res.send("dd")
// })

router.get('/home' , isLoggedIn,async function(req,res,next){
  const allUser = await userModel.find({
    username: {$ne: req.session.passport.user}
  })
  res.render('home' ,{allUser});  
})
router.get('/profile' ,isLoggedIn , async function(req , res){
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const posts  =  await postModel.find({
    user:user._id
  })
  
  res.render('profile', {user,posts});

})
router.post("/register", function (req, res) {
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
  });

  userModel.register(user, req.body.password).then(function (registereduser) {
    passport.authenticate("local")(req, res, function () {
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

router.get("/logout", function (req, res) {
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
    res.redirect("/");
  }
}

 
module.exports = router;
