const pool = require("../db");

const router = require("express").Router();
const bcrypt = require("bcrypt");
const tokenGenerator = require("../utils/tokenGenerator");
const validator = require("../middleware/validator")
const authorization = require("../middleware/authorization")



router.post("/register",validator, async(req,res) => {

try {

// decon

    const {name,email,password} = req.body;

// check

const user = await pool.query(`select * from users where user_email = $1`, [email]);

if(user.rows.length !== 0){
    return res.status(401).json("User already exist")
}

//encrypt password

const round = 10;
const salt = await bcrypt.genSalt(round);

const encryptedPassword = await bcrypt.hash(password,salt);

// Insert new user
const newUser = await pool.query (`insert into users (user_name,user_email,user_password) values ($1,$2,$3) returning *`,
[name,email,encryptedPassword]);

// generate token


const token  = tokenGenerator(newUser.rows[0].user_id);

res.json({ token })
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
}


});

// login

router.post("/login",validator, async (req,res) => {

    try {
        // reconstruct req.body
        const {email,password} = req.body;

        //check if exist
        const user = await pool.query(`select * from users where user_email = $1`, [email])

        if(user.rows.length === 0){
            return res.status(401).json("User Not found");
        }


        // check if password is correct
        const validPassword = await bcrypt.compare(password,user.rows[0].user_password);

      if (!validPassword) {
      return res.status(401).json("Invalid Password");
    }

        // give token

        const token = tokenGenerator(user.rows[0].user_id)
        
        res.json({token})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }


});

 router.get("/is-verify", authorization, async(req,res) => {
    try {
        
        res.json(true);

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }


 });

module.exports=router;