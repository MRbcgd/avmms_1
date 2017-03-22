module.exports=function(passport){
  var conn=require('../config/db.js')();
  var router=require('express').Router();

  router.get('/signin',function(req, res, next){
    var user=req.user;
    res.render('./auth/signin',{
      title: 'VMMS',
      user
    });
  });
  router.post('/signin',//passport
    passport.authenticate('local',{
      successRedirect: '/',
      failureRedirect: '/auth/signin',//검증에서 false를 done했다면
      failureFlash: false
    })
  );
  router.get('/signout',function(req,res){
    req.logout();
    req.session.save(function(){
      res.redirect('/');
    });
  });
  return router;
}

  // router.get('/logout',function(req,res){
  //   req.logout();
  //   req.session.save(function(){
  //     res.redirect('/home');
  //   });
  // })
  // router.get('/register',function(req,res){//register
  //   var user=req.user;
  //     res.render('./mysql/auth/register',{user});
  // })
  // router.post('/register',function(req,res){
  //   var user={
  //     authId:'local:'+req.body.username,
  //     username:req.body.username,
  //     password:req.body.password,
  //     displayName:req.body.displayName
  //   }
  //   var sql='SELECT * FROM users WHERE authID=?';
  //
  //   conn.query(sql,user.authId,function(err,results){
  //     if(err){
  //       console.log(err);
  //       res.status(500).send('Internal Server Error');
  //     }
  //     else{
  //       if(results.length>0){//이미 존재한다면
  //         console.log('Already Exists, Try Again!');
  //         res.redirect('register');
  //       }
  //       else{
  //         var sql='INSERT INTO users SET ?';
  //         conn.query(sql,user,function(err,results){
  //           if(err){
  //             console.log(err);
  //             res.status(500).send('Internal Server Error');
  //           }
  //           else{
  //             console.log('Register Success, Login!');
  //             req.login(user,function(err){
  //               req.session.save(function(){//passport
  //                 res.redirect('/home');
  //               })
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // })
  // router.get('/replace',function(req,res){
  //   var user=req.user;
  //   res.render('./mysql/auth/replace',{user});
  // })
  // router.post('/replace',function(req,res){
  //   var user={
  //     password:req.body.password,
  //     displayName:req.body.displayName
  //   }
  //   var sql='UPDATE users SET ? WHERE username=?';
  //   conn.query(sql,[user,req.user.username],function(err,results){
  //     if(err){
  //       console.log(err);
  //     }
  //     if(results.length>0){
  //       console.log('Update Success!');
  //       res.redirect('/home');
  //     }
  //   })
  //
  //
  // })
  // router.get('/delete',function(req,res){
  //   var user=req.user;
  //   res.render('./mysql/auth/delete',{user});
  // })
  // router.post('/delete',function(req,res){
  //   var password=req.body.password;
  //   var sql='DELETE FROM users WHERE username=?';
  //   conn.query(sql,[req.user.username],function(err,results){
  //     if(err){
  //       console.log(err);
  //       res.status(500).send('Internal Server Error');
  //     }
  //     if(results.length>0){
  //       console.log('Delete Success!');
  //       res.redirect('/home');
  //     }
  //   })
  // })
  // router.get('/facebook',passport.authenticate('facebook',{scope:'email'}));//facebook
  // router.get('/facebook/callback',//facebook
  //   passport.authenticate('facebook', { successRedirect: '/home',
  //                                       failureRedirect: '/auth/login' }));
