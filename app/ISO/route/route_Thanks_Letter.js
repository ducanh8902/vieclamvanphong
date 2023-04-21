module.exports = function (app,isLoggedIn,newApplyUT,isLoggedInISO_next,getTime,User) {
    app.get("/iso/Show_Thanks_Letter",isLoggedInISO_next,async function(req,res,next){
      try{
      var Thanks = await newApplyUT.aggregate([
        {$match:{"Interview.ResultInterview":{$in:["Fail","Pending"]}}},
        {$group:{_id:{Year:"$FillterNam",Month:"$FiffterThang"},
          List:{$addToSet:{result: "$_id", NameUT: "$NameUT", EmailUT: "$EmailUT", PhoneUT: "$PhoneUT",ResultInterview:"$Interview.ResultInterview"}}}},
          {$addFields:{month:{$toInt:"$_id.Month"}}},
          {$sort:{month: -1}},
        {$group:{_id:{Year:"$_id.Year"},
          result:{$addToSet:{Month:"$month",List:"$List"}},
        }},
      
      ])
      res.render("iso/View_iso/Thanks_Letter.ejs",{Thanks:Thanks,user:req.user})
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
    })
    app.get("/iso/Thanks_letter_template",isLoggedInISO_next,async function(req,res,next){
      res.render("iso/BieuMau/Thanks_Letter.ejs")
  })
  app.get("/iso/print_thanks_interview=:rel-iduser=:user",isLoggedInISO_next,async function(req,res,next){
    try{
    const UserRequest = await User.findOne({_id:req.params.user})
    if( UserRequest.iso == true){
    newApplyUT.findOne({_id:req.params.rel}).exec((err,infoUser)=>{
      var message ="";
      if(infoUser.Interview.ResultInterview == "Fail"){
        message ="dựa theo yêu cầu công việc,Anh/Chị vẫn Chưa Đạt các tiêu chí theo yêu cầu của bộ phận đề xuất tuyển dụng.Hy vọng sẽ được hợp tác với bạn trong dự án khác của Côngn Ty trong tương lai"
      }
      if(infoUser.Interview.ResultInterview == "Pending"){
        message ="chúng tôi hy vọng Anh/Chị sẽ suy nghĩ thêm về công việc , và có thể hợp tác với Anh/Chị trong trương lai"
      }
      res.render("iso/Print/thu-cam-on.ejs",{Ung_Vien:infoUser,message:message})
    }) 
    }else{
      res.writeHead(301, {
          Location: `http://tuyendung.me/404`
        }).end();
     }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/Thanks_letter_detail_id=:result",isLoggedInISO_next,async function(req,res,next){
    try{
    newApplyUT.findOne({_id:req.params.result}).exec((err,Ung_Vien)=>{
      var message ="";
      if(Ung_Vien.Interview.ResultInterview == "Fail"){
        message ="dựa theo yêu cầu công việc,Anh/Chị vẫn Chưa Đạt các tiêu chí theo yêu cầu của bộ phận đề xuất tuyển dụng.Hy vọng sẽ được hợp tác với bạn trong dự án khác của Côngn Ty trong tương lai"
      }
      if(Ung_Vien.Interview.ResultInterview == "Pending"){
        message ="chúng tôi hy vọng Anh/Chị sẽ suy nghĩ thêm về công việc , và có thể hợp tác với Anh/Chị trong trương lai"
      }
      res.render("iso/View_iso/Letter/thanks_interview.ejs",{Ung_Vien:Ung_Vien,message:message})
    })
  } catch (err) {
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })

}