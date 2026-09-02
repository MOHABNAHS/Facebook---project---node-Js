const express = require("express");
const pool = require("./db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/verifyToken")
const { generateToken, generateRefreshToken } = require("./auth");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../front-end")));

// [post] POSTS
app.post("/posts", verifyToken, async (req, res) => {
    try{
        const { text } = req.body;
        const user_id = req.user.id;

        const result = await pool.query(
            "INSERT INTO posts (text, user_id) VALUES ($1, $2) RETURNING *",
            [text, user_id]
        );

        res.json(result.rows[0]);
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            message: "[ERROR][POST] posts"
        })
    }
})

// [get] POSTS
app.get("/posts", verifyToken, async (req, res) =>{
    try{
        const result = await pool.query(
            "SELECT * FROM posts ORDER BY created_at DESC"
        );
        res.json(result.rows);
    }
    catch (error){
        console.log(error);
        res.status(500).json({
            message: "[ERORR][GET] posts"
        })
    }
})

// [get] POSTS:ID
app.get("/posts/:id", verifyToken, async (req, res)=>{
    try{
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM posts WHERE id = $1",
            [id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({
                message: "post not found"
            })
        }

        res.json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "[ERROR][GET] posts:id"
        })
    }
})

// [put] POSTS:ID
app.put("/posts/:id", verifyToken, async (req, res)=>{
    try{
        const { id } = req.params;
        const { text } = req.body;
        const user_id = req.user.id

        const result = await pool.query(
            "UPDATE posts SET text = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
            [text, id, user_id]
        )
        if(result.rows.length === 0 ){
            return res.status(404).json({
                message: "post not found"
            })
        }
        res.json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "[ERROR][PUT] posts/:id"
        })
    }
})

// [delete] DELETE/:ID
app.delete("/posts/:id", verifyToken, async (req,res)=>{
    try{
        const { id } = req.params;
        const user_id = req.user.id;

        const result = await pool.query(
            "DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *",
            [ id, user_id]
        )
        if(result.rows.length === 0){
            return res.status(404).json({
                message: "post not found"
            })
        }
        res.json({
            message: "post deleted",
            post: result.rows[0]
        })
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            message: "[ERROR][DELETE] posts/:id"
        })
    }
})

// [POST] REGISTER
app.post("/register", async (req, res) =>{
    try{
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password,10);

        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at",
            [username, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    }
    catch(error){
        res.status(500).json({
            message: "[ERROR][POST] register",
            error: error
        })
    }
})

// [GET] users
app.get("/users", verifyToken, async (req, res) =>{
    try{
        const result = await pool.query(
            "SELECT * FROM users"
        )

        res.status(200).json(result.rows)
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            message: "[ERROR][GET] users",
            error: error
        })
    }
})

// [POST] login
app.post("/login", async (req, res) => {
    try{
        const {username, password} = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        )

        if(result.rows.length == 0){
            return res.status(401).json({
                message: "invalid username or password"
            })
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                message: "invalid username or password"
            })
        }

        const token = generateToken(user)
        const refreshToken = generateRefreshToken(user);

        res.json({
            message: "login successfully",
            token: token,
            refreshToken: refreshToken
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            error: error
        })
    }
})


// [POST] refresh
app.post("/refresh", (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token missing"
        });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.refresh_secret
        );

        const newToken = generateToken({
            id: decoded.id,
            username: decoded.username
        });

        res.json({
            token: newToken
        });
    }
    catch (error) {
        res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
});



app.listen(5000, ()=>{
    console.log("server is running on port 5000");
});