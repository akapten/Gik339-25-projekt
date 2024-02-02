//körexpresspaketet och sqlite till variabler
const sqlite = require("sqlite3").verbose();
const express = require("express");
const server = express();

// Skapa en ny SQLite-databasanslutning
const db = new sqlite.Database("./gik399.db");
server
  .use(express.json()) //gör att vi kan ta emot json i req.body
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    // tilllåter att alla adresser, headers och metoder körs mot servern
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
     // skickar fråga vidare så att vi kan behandla den senare
    next();
  });
//starta servern och lyssna på port:3000
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
// get frågan som retunerar alla rader i databasen
server.get("/bilr", (req, res) => {
  const sql = "SELECT * FROM bilr";
  db.all(sql, (err, rows) => {
    if (err) res.status(500).send(err);
    else res.send(rows);
  });
});
// get fråga som returnerar en specifik bil baserat på 
server.get("/bilr/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM bilr WHERE id=${id}`;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows[0]);
    }
  });
});
//Put fråga för att uppdatera en befintlig bil
server.put("/bilr", (req, res) => {
  const updatedBilr = req.body;
  const id = updatedBilr.id;

  const bil = {
    regnr: updatedBilr.regnr,
    model: updatedBilr.model,
    mfr: updatedBilr.mfr,
    color: updatedBilr.color,
  };

  let updateString = "";
  const columnsArray = Object.keys(bil);
  columnsArray.forEach((column, i) => {
    updateString += `${column}="${bil[column]}"`;
    if (i !== columnsArray.length - 1) updateString += ",";
  });

  const sql = `UPDATE bilr SET ${updateString} WHERE id=${id}`;

  db.run(sql, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send("Updated");
    }
  });
});
// post fråga för att lägga till en bil med INSERT
server.post("/bilr", (req, res) => {
  const bil = req.body;
  const sql = `INSERT INTO bilr(regnr, model, mfr, color) VALUES(?,?,?,?)`;
  db.run(sql, Object.values(bil), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send("Car saved");
    }
  });
});
// Delete för att tabort en bil
server.delete("/bilr/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM bilr WHERE id = ${id}`;

  db.run(sql, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send("Deleted");
    }
  });
});
