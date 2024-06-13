const express = require ('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');
const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    password:'minorProject*&^6',
    database: 'to_do_list'
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', async (req, res) => {
    console.log('get app');
    try {
        const result = await pool.query('SELECT * FROM tasks');
        console.log(result[0]);
        res.json({tasks: result[0]}); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/tasks', async (req, res) => {
    console.log('post app');
    const  Title = req.body.title;
    const  Status = req.body.status;

    try {
        const [result] = await pool.query(
        'INSERT INTO tasks (Title, Status, CreatedAt, UpdatedAt) VALUES (?, ?, NOW(), NOW())',
        [Title, Status]
        );

        res.status(201).json({
        message: 'Task created successfully',
        taskId: result.insertId,
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Could not create task' });
    }
});
  
app.delete('/tasks', async (req, res) => {
    console.log('delete app');
    const  taskId  = req.query.taskId;
    console.log(taskId);

    try {
        const [result] = await pool.query(
        'DELETE FROM tasks WHERE TaskId = ?',
        [taskId]
        );

        if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Task deleted successfully' });
        } else {
        res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Could not delete task' });
    }
});
  
app.patch('/tasks/', async (req, res) => {
    console.log('patch app');
    const  Title = req.body.title;
    const  Status = req.body.status;
    const taskId = req.query.taskId;
    console.log(taskId);

    let query = 'UPDATE tasks SET ';
    let values = [];
    let fields = [];

    if (Title) {
        fields.push('Title = ?');
        values.push(Title);
    }

    if (Status) {
        fields.push('Status = ?');
        values.push(Status);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    query += fields.join(', ');
    query += ', UpdatedAt = NOW() WHERE TaskId = ?';
    values.push(taskId);
    console.log(query, values);
    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Task updated successfully' });
        } else {
            res.status(404).json({ message: 'Task not found', results: result });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Could not update task' });
    }
});

  
app.listen(port, () =>{
    console.log(`server running on http://localhost:${port}`);
})