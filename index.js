import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

// PostgreSQL Client Setup
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Chauhan@123",
  port: 5432,
});
db.connect();

app.use(bodyParser.json()); // To parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // To parse URL-encoded bodies

app.use(express.static("public"));

// Set EJS as the template engine
app.set("view engine", "ejs");

// Serve your EJS pages with error handling
app.get("/", (req, res) => {
  res.render("index", { error: null, showLoginModal: false });
});

// Registration Route
app.post("/register", async (req, res) => {
  const { fullname, email, password, phone } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      res.render("index", { error: "Email already exists. Try logging in.", showLoginModal: false });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password", err);
          res.status(500).render("index", { error: "Internal server error. Please try again later.", showLoginModal: false });
        } else {
          const result = await db.query(
            "INSERT INTO users (fullname, email, password, phone) VALUES ($1, $2, $3, $4)",
            [fullname, email, hash, phone]
          );
          console.log(result);
          res.redirect("/");
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).render("index", { error: "Internal server error. Please try again later.", showLoginModal: false });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request for email:', email); // This should now log the correct email

  if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
  }

  try {
      const result = await db.query("SELECT * FROM users WHERE email ILIKE $1", [email]);

      if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.password;

          bcrypt.compare(password, storedHashedPassword, (err, match) => {
              if (err) {
                  console.error("Error comparing passwords:", err);
                  return res.status(500).json({ error: "Internal server error. Please try again later." });
              }
              if (match) {
                  return res.status(200).json({ success: true });
              } else {
                  return res.status(401).json({ error: "Incorrect password." });
              }
          });
      } else {
          return res.status(404).json({ error: "User not found." });
      }
  } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
