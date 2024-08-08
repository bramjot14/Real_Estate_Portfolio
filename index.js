import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Chauhan@123",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

app.get("/", async (req, res) => {
  try {
    res.render("index.ejs");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
})

// app.post("/add", async (req, res) => {
//   const item = req.body.newItem;
//  // items.push({ title: item });
//  try {
//   await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
//   res.redirect("/");
// } catch (err) {
//   console.error(err);
//   res.status(500).send("Server Error");
// }
// });

// app.post("/edit", async (req, res) => {
//   const itemId = req.body.updatedItemId;
//   const itemTitle = req.body.updatedItemTitle;

//   try {
//     await db.query("UPDATE items SET title = $1 WHERE id = $2;", [itemTitle, itemId]);
//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// app.post("/delete", async (req, res) => {
//   const itemId = req.body.deleteItemId;

//   try {
//     await db.query("DELETE FROM items WHERE id = $1;", [itemId]);
//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Test Commit