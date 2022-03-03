const express = require("express");
const session = require("express-session");
const mysql = require("mysql");

const connectionInfo = {
  host: "localhost",
  user: "root",
  password: "",
  database: "GiftsDb"
};
let connection = mysql.createConnection(connectionInfo);
connection.connect(function(err) {
  if(err)
    throw err;
});

const app = express();

const sessionOptions = {
  secret: "happy jungle",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
};
app.use(session(sessionOptions));

app.get("/", listGifts);
app.get("/add", addGift);
app.get("/clear", clearGifts);
app.get("/info", getInfo);

const port = 3000;
app.listen(port,  process.env.IP, startHandler());

function startHandler() {
  console.log("Server listening at " + process.env.IP + `:${port}`);
}

function listGifts(req, res) {
  connection.query("SELECT Name FROM Gifts", function(err, dbResult) {
    if(err) {
      writeResult(res, {"error": "There was an error"});
    }
    else {
      incrementVisits(req);

      let giftNames = [];
      dbResult.forEach(gift => giftNames.push(gift.Name));
      writeResult(res, {"gifts": giftNames});
    }
  });
}

function addGift(req, res) {
  if(req.query.gift === undefined || req.query.gift.length === 0) {
    writeResult(res, {"error": "gift is required"});
  }
  else {
    connection.query("INSERT INTO Gifts(Name) VALUES(?)", req.query.gift, function(err) {
      if(err) {
        let message = "There was an error";
        if(err.code == "ER_DUP_ENTRY")
          message = "This gift was already given";

        writeResult(res, {"error": message});
      }
      else {
        incrementGifts(req);
        listGifts(req, res);
      }

    })
  }
}

function clearGifts(req, res) {
  connection.query("DELETE FROM Gifts", function(err) {
    if(err) {
      writeResult(res, {"error": "There was an error"});
    }
    else {
      listGifts(req, res);
    }
  });
}

function getInfo(req, res) {
  connection.query("SELECT COUNT(1) AS totalGifts FROM Gifts", function(err, dbResult) {
    if(err) {
      writeResult(res, {"error": "There was an error"});
    }
    else {
      let object = {
        "totalGifts": dbResult[0].totalGifts,
        "sessionVisits": req.session.visits || 0,
        "sessionGiftsAdded": req.session.gifts || 0
      };
      writeResult(res, object);
    }
  });
}

function writeResult(res, result) {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify(result));
}

function incrementVisits(req) {
  if(req.session.visits === undefined)
    req.session.visits = 0;

  req.session.visits++;
}

function incrementGifts(req) {
  if(req.session.gifts === undefined)
    req.session.gifts = 0;

  req.session.gifts++;
}