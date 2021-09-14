const express= require('express')
const mysql= require('mysql2')
const app = express()
const port = 3000
var stemmer = require('./porter-stemmer-master/porter').stemmer
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.listen(port,()=>console.info(`Listening on port ${port}`))

//import {stemmer} from 'stemmer'              //sa
var natural = require('natural');             //ma



var myConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "asd123asd",
    database: "searchengine",
    multipleStatements: true
})

myConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  })

var searchtopic;    //search value
var arrRes=[];      //to store query results
var results=[];
var recomendations=[]
var ret=[];

app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('',(req, res)=>{
    res.render('main')
})

app.get('/',(req, res)=>{
    res.render('main')
})

app.post('/search', urlencodedParser,(req,res)=>{
    searchtopic=req.body.searchTopic;
   // console.log(searchtopic)
   searchtopic=stemmer(searchtopic) 

   var sql3 = ` SELECT * FROM suggestions
                WHERE sugg_word='${req.body.searchTopic}';`;
    
    ret=[]
    
    myConnection.query(sql3, async(error,ret,fields) => {
        if (error) res.send(error)
        console.log(ret)
        if(ret.length==0) {
            var sql2 = ` INSERT INTO suggestions
                            VALUES('${req.body.searchTopic}');`;
                            
                myConnection.query(sql2, async(error) => {
                    if (error) res.send(error)
                } )
        }
        
    } )

    

    var sql = ` SELECT doc_id,title,link,des 
                FROM Pages
                join Words 
                on doc_id=id
                WHERE word='${searchtopic}' ;`;

    myConnection.query(sql, async(error, arrRes, fields) => {
        console.log(arrRes.length)

        if (error) res.send(error);
        if (!arrRes[0]) {
             res.json("Not Found");
        } 

        //console.log(arrRes)
        var returned = arrRes.slice(0,10)
        res.render('Results',{ result:returned, page:"1" })
    })
 
})

app.post('/next', urlencodedParser,(req,res)=>{


    var sql = ` SELECT doc_id,title,link,des 
                FROM Pages
                join Words 
                on doc_id=id
                WHERE word='${searchtopic}' ;`;

    myConnection.query(sql, async(error, arrRes, fields) => {
        console.log(arrRes.length)

        if (error) res.send(error);
        if (!arrRes[0]) {
             res.json("Not Found");
        } 

        var returned = arrRes.slice((req.body.pageNum-1)*10,(req.body.pageNum-1)*10+10)
        if(arrRes[(req.body.pageNum-1)*10]){
            res.render('Results',{ result:returned, page:req.body.pageNum })
        }
        else{
            res.render('Results',{ result:"", page:req.body.pageNum })
        }
        
    })
    
})
app.post('/back', urlencodedParser,(req,res)=>{

    var sql = ` SELECT doc_id,title,link,des 
                FROM Pages
                join Words 
                on doc_id=id
                WHERE word='${searchtopic}' ;`;

    myConnection.query(sql, async(error, arrRes, fields) => {
        console.log(arrRes.length)

        if (error) res.send(error);
        if (!arrRes[0]) {
             res.json("Not Found");
        } 

        var returned = arrRes.slice((req.body.pageNum-1)*10,(req.body.pageNum-1)*10+10)
        res.render('Results',{ result:returned, page:req.body.pageNum })
        
    })
    
})

app.post('/suggest/:params',urlencodedParser,(req,res)=>{
    var reqWord=req.url.slice(9,req.url.length);
    recomendations=[]
    results=[]

    if(reqWord.length!=0){

        var sql4 = ` SELECT * FROM suggestions
                WHERE sugg_word LIKE "${reqWord}%";`;
    
        myConnection.query(sql4, async(error,recomendations,fields) => {
            if (error) res.send(error)
            for(var i=0 ; i<recomendations.length; i++){
                 results.push({ sugg_word:recomendations[i].sugg_word});
            }
            res.send(JSON.stringify(results));
        } )

    }
    else{
        res.send("");
    }
});