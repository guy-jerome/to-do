import express from "express"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.static("public"))


const pool = new pg.Pool({
  user:'postgres',
  host: 'localhost',
  database: 'postgres',
  password: process.env.DB_PASS,
  port: 5432
})

app.get('/api/todos', async (req,res)=>{
  const client = await pool.connect();
  const response = await client.query('SELECT * FROM todo')
  res.status(200).json(response.rows)
  client.release()
})

app.get('/api/todos/:id', async (req,res)=>{
  const id = req.params.id
  const client = await pool.connect();
  const response = await client.query('SELECT * FROM todo WHERE id = $1;',[id])
  const data = response.rows[0]
  res.status(200).json(data)
})

app.post('/api/todos', async (req,res)=>{
  const {name, content} = req.body
  const client = await pool.connect();
  try{
    const response = await client.query('INSERT INTO todo (name, content) VALUES ($1,$2) RETURNING *;', [name,content])
    const data = response.rows[0]
    res.status(200).json(data)
  }catch (error){
    res.status(500).json({error:"Internal Error"})
  }finally{
    client.release()
  }

})

app.delete('/api/todos/:id', async (req, res)=>{
  const id = req.params.id
  const client = await pool.connect();
  const response = await client.query('DELETE FROM todo WHERE id = $1 RETURNING *;', [id])
  const data = response.rows[0]
  res.status(200).json(data)
  client.release()
})

app.put('/api/todos/:id', async (req, res)=>{
  const id = req.params.id
  const {name, content} = req.body
  const client = await pool.connect();
  const response = await client.query('UPDATE todo SET name = $1, content = $2 WHERE id = $3;', [name,content,id])
  res.status(200).json({message:"todo updated"})
  client.release()
})

app.listen(port, ()=>{
  console.log("Server Listening on Port", port)
})