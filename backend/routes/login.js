const express = require('express');
const router = express.Router();

const { connection } = require('../database/mysql');

//로그인하기
router.post('/login', (req,res) => {
    console.log(req.body);
    let info = req.body;
    let id = info.id;

    connection.getConnection(function(err, conn){
        conn.query('SELECT * FROM user WHERE id=?',[id], (err,user)=> {
            if(user.length==0){
                console.log(err);
                conn.query('INSERT INTO user values (?,?)', [id, 0], (err,inserted_user)=>{
                    if(err){
                        console.log(err);
                        res.json({ id: null});
                    }else{
                        console.log(inserted_user);
                        res.json({id:inserted_user})
                    }
                })
            }else{
                console.log(user);
                res.json({
                    id: user
                });
            }
        })
        conn.release();
    })
});

module.exports = router;