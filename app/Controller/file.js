module.exports = function (app,conn,mongoose,Grid,upload) {
  var gfs;
  conn.once('open', function() {
    gfs = Grid(conn, mongoose.mongo);
    gfs.collection('uploads');
    console.log("opend")
  });  
  app.get('/files/:filename', (req, res,next) => {
    try{
       gfs.files.findOne({ filename: req.params.filename}, (err, file) => {
      if (!file || file.length === 0) {
        return res.render("View-profile/404.ejs",{message:"File không tồn tại"})
      }
      if (file.contentType === 'application/pdf' || file.contentType === 'video/mp4' || 
      file.contentType === 'image/jpeg' || file.contentType === 'application/msword' || 
      file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      || file.contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        return res.json(file);
      }
    });
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.get('/image/:filename', (req, res,next) => {
    try{
    gfs.files.findOne({ filename: req.params.filename}, (err, file) => {
      if (!file || file.length === 0) {
        return res.render("View-profile/404.ejs",{message:"File không tồn tại"})
      }
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
};