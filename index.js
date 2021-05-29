const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");


//middle ware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Routes

app.use("/auth",require("./routes/auth"));

app.use("/dashboard",require("./routes/dashboard"));



//create
app.post("/todos", async (req, res) => {

    try {
        const { desc } = req.body;
        const { notes } = req.body;
        const {userId} = req.body;
        const {privacy} = req.body;
        const sql = `insert into todo(todo_desc,todo_date,todo_notes,user_id,privacy)
         values ($1,CURRENT_TIMESTAMP,$2,$3,$4)
 returning * 
  
          `;
        const rs = await pool.query(sql, [desc,notes,userId,privacy]);

        res.json(rs)
    } catch (err) {
        console.error(err.message);
    }
 
});
app.put("/updateprivacy/:id", async (req, res) => {

    try {
        const { id } = req.params;
  
        const sql = ` call privacyUpdate($1)
  
          `;
        const rs = await pool.query(sql, [id]);

        res.json(rs)
    } catch (err) {
        console.error(err.message);
    }
 
});
//get all
app.get("/todos-private", async (req, res) => {

    try {
        const sql = `select t.*, u.user_name "name" from private_todo t
        LEFT OUTER JOIN users u ON u.user_id = t.user_id
    order by "todo_id" ASC `;
        const rs = await pool.query(sql);
        res.json(rs.rows)
    } catch (err) {
        console.error(err.message);
    }

});

app.get("/todos-public", async (req, res) => {

    try {
        const sql = `select t.*, u.user_name "name" from public_todo t
        LEFT OUTER JOIN users u ON u.user_id = t.user_id
    order by "todo_id" ASC `;
        const rs = await pool.query(sql);
        res.json(rs.rows)
    } catch (err) {
        console.error(err.message);
    }

});


app.get("/todos/category", async (req, res) => {

    try {
        const sql = `select * from category `;
        const rs = await pool.query(sql);
        res.json(rs.rows)
    } catch (err) {
        console.error(err.message);
    }

});

app.get("/todos/count-public", async (req, res) => {

    try {
        const sql = `select count(*) "count" from public_todo `;
        const rs = await pool.query(sql);
        res.json(rs.rows[0])
    } catch (err) {
        console.error(err.message);
    }

});
app.get("/todos/count-private/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
        const sql = `select count(*) from private_todo where user_id = $1 `;
        const rs = await pool.query(sql,[id]);
        res.json(rs.rows[0])
    } catch (err) {
        console.error(err.message);
    }

});
// get a todo
app.get("/todos/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const sql = `select * from todo where todo_id = $1 `;
        const rs = await pool.query(sql, [id]);
        res.json(rs.rows[0])
    } catch (err) {
        console.error(err.message);
    }

});


//update a todo

app.put("/todos/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const { notes } = req.body;
        const { desc } = req.body;
        const sql = `update todo set todo_desc = $1,  todo_notes = $3 where todo_id = $2 `;
        const rs = await pool.query(sql, [desc, id,notes]);
        res.json("Todo was updated")
    } catch (err) {
        console.error(err.message);
    }
     
});

app.put("/todos/category/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const { categ } = req.body;
        const sql = `update todo set cat_id = $1 where todo_id = $2 `;
        const rs = await pool.query(sql, [categ, id]);
        res.json("Todo was updated")
    } catch (err) {
        console.error(err.message);
    }
 
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started as localhost at Port: ${PORT}`)
})

// delete

app.delete("/todos/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const sql = `DELETE FROM public.todo
        WHERE todo_id = $1`;
        const rs = await pool.query(sql, [id]);
        res.json("Todo was Deleted")
    } catch (err) {
        console.error(err.message);
    }

});