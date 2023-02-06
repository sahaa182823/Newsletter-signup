const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res) => {
   res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req,res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData =JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/e83466d68c"

    const options = {
        method: "POST",
        auth: "anirban:5259355596f2ca56bcc5575afc4af39c-us8",
    }

    const request = https.request(url, options, (response) => {
        console.log(response.statusCode);
        response.on('data', (data)=>{
            console.log(JSON.parse(data));
        });

        if(response.statusCode === 200){
            //res.send("<p>Subscribed News letter succesfully!!</p>");
            res.sendFile(__dirname + "/success.html")
        }else{
            //res.send("Try agian after sometime!!");
            res.sendFile(__dirname + "/failure.html")
        }
    });

    request.write(jsonData);
    request.end();

});


app.post("/failure", (req, res) =>{

    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {   //instead of 3000 we need to use process.env.PORT so that Heroku can deploy the app in any port dynamically
    console.log("Server is runniong on port 3000");
});


//API key
//5259355596f2ca56bcc5575afc4af39c-us8

//List id
//e83466d68c