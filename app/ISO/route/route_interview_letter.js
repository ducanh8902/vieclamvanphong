module.exports = function (app,isLoggedIn,newApplyUT,isLoggedInISO_next,User) {
    app.get("/iso/Show_Interview_Letter",isLoggedInISO_next,async function(req,res,next){
      try{
        const Thanks = await newApplyUT.aggregate([
          {$group:{_id:{Year:"$FillterNam",Month:"$FiffterThang"},
            List:{$addToSet:{result: "$_id", NameUT: "$NameUT", EmailUT: "$EmailUT", PhoneUT: "$PhoneUT"}}}},
            {$addFields:{month:{$toInt:"$_id.Month"}}},
            {$sort:{month: -1}},
          {$group:{_id:{Year:"$_id.Year"},
            result:{$addToSet:{Month:"$month",List:"$List"}},
          }},
        ])
      res.render("iso/View_iso/Interview_Letter.ejs",{Thanks:Thanks,user:req.user})
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
    })
    app.get("/iso/interview_letter_template",isLoggedInISO_next,async function(req,res,next){
      try{
      res.render("iso/BieuMau/interview_letter.ejs")
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/print-thu-moi-phong-van-id=:rel-iduser=:user",async function(req,res,next){
    try{
    const UserRequest = await User.findOne({_id:req.params.user})
    if( UserRequest.iso == true){
    newApplyUT.findOne({_id:req.params.rel}).exec((err,infoUser)=>{
        res.render("iso/Print/thu-moi-phong-van.ejs",{Ung_Vien:infoUser})
    }) 
    }else{
      res.writeHead(301, {
          Location: `http://tuyendung.me/404`
        }).end();
     }
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/interview_letter_detail_id=:result",isLoggedInISO_next,async function(req,res,next){
    try{
    newApplyUT.findOne({_id:req.params.result}).exec((err,Ung_Vien)=>{
        res.render("iso/View_iso/Letter/letter_interview.ejs",{Ung_Vien:Ung_Vien})
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
}