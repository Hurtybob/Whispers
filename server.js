var express = require("express")
  , app = express()
  , http = require("http").createServer (app)
  , bodyParser = require("body-parser")
  , lessMiddleware = require("less-middleware")
  , fs =require("fs")
  , session = require("express-session")
  , FileStore = require("session-file-store")(session)
  , sqlite3 = require("sqlite3").verbose()
  , db = new sqlite3.Database("db/data.db")
  , crypto = require("crypto");

/* server config */
app.set("ipaddr", "0.0.0.0");
app.set("port", 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

  /*database*/
if(fs.statSync("db/data.db")["size"] == 0){
	fs.readFile("db/create.sql", "UTF8", function(err, data){
		var statements = data.split(";");
		db.serialize(function(){
			for(var i = 0; i < statements.length - 1; i++){
				db.run(statements[i]);
			}
		});
	});
}

/*server middleware */
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static("public", __dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	store: new FileStore,
    secret: 'ouf  eipjri0erw9fvinod0',
    resave: true,
    saveUninitialized: false
}));

/* functions */
function hashPassword(password, salt){
	var hash = crypto.createHash('sha256');
	hash.update(password);
	hash.update(salt);
	return hash.digest('hex');
}

/* routes*/
app.get("/", function(request, response) {
  db.get("select max(idWhisper) as max from whispers;", function(err, row){
      var whisper = Math.floor(Math.random()*(row.max)+1);
      db.get("select whisper from whispers where idWhisper=?", whisper, function(err, row){
         response.locals.whisper = row.whisper;
         response.render('index');
      });
  });
});

app.get("/login",function(request, response) {
  response.render("login");
});

app.post("/login",function(request, response){
  var user = request.body['username'];
  var pass = request.body['password'];
  db.get("select * from users where username=?", user, function(err, row){
    if (typeof row === "undefined"){
      // user not found
      response.render("login");
    } else {
      pass = hashPassword(pass, row.salt);
      if (row.password == pass){
        request.session.user = user;
        //request.session.iduser = row.iduser;
        //response.redirect('/signin');
        response.redirect("/admin");
      } else {
        response.render("login");
        //username or password is wrong.
      }
    }
  });
  // select * from users where username= username
});

app.get("/admin",function(request, response){
  if (request.session.user == "admin") {
    response.render("admin");
  } else {
    response.render("login");
  }

});

//app.post create use login a whole bunch for the reference on how to do
//learn to do a db.run
//server localhost:3000
http.listen(app.get("port"), app.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});
