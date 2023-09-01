const express = require("express");
const { Client } = require("pg");

const client = new Client({
  host: "dpg-cjothim1208c738hvtlg-a.oregon-postgres.render.com",
  port: 5432,
  database: "my_portfolio_fmzg",
  user: "phantoxe",
  password: "tR0ievJUi1dUNjX9Fu5wcLrMN8oGkBvt",
  ssl: { rejectUnauthorized: false },
});

client
  .connect()
  .then(() => console.log("Conectado!"))
  .catch((err) => console.error("Erro na conexão:", err));

const app = express();
app.use(express.json());

// CREATE
app.post("/users", async (req, res) => {
  const { name } = req.body;
  const newUser = await client.query(
    "INSERT INTO users (name) VALUES ($1) RETURNING *",
    [name]
  );
  res.json(newUser.rows[0]);
});

// READ
app.get("/users", async (_, res) => {
  const allUsers = await client.query("SELECT * FROM users");
  res.json(allUsers.rows);
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await client.query("UPDATE users SET name = $1 WHERE id = $2", [name, id]);
  res.json(`User with ID ${id} updated`);
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await client.query("DELETE FROM users WHERE id = $1", [id]);
  res.json(`User with ID ${id} deleted`);
});

app.listen(5000, () => {
  console.log("Server running on port 3000");
});
