var express = require('express');
var app = express();
var bodyParser=require('body-parser');
var fs=require('fs');

app.use(express.static('public'));

//Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//check if the repository (user_file.json) exist
var users=fs.existsSync('user_file.json');
var props=fs.existsSync('prop_file.json');

var userObj={"user":[]};
var propObj={"property":[]};

//Load the JSON files to get the files stored
if(users){
	//Log to console
	console.log('Loading the users');
	//Read file
	var usersInfo=fs.readFileSync('user_file.json','utf-8');
	userObj=JSON.parse(usersInfo);
}
if(props){
        //Log to console
        console.log('Loading the properties');
        //Read file
        var propsInfo=fs.readFileSync('prop_file.json','utf-8');
        propObj=JSON.parse(propsInfo);
}

//user login
app.get('/login',(req,res)=>{
	res.sendFile(__dirname + "/login.html");
});


//Main Page
app.get('/',(req,res)=>{
	res.sendFile(__dirname + "/index.html");
});
//redirect to register user
app.get('/register',(req,res)=>{
        res.sendFile(__dirname + "/index.html");
});

//redirect to owner's page
app.get('/owner',(req,res)=>{
        res.sendFile(__dirname + "/owner.html");
});

app.get('/coworker',(req,res)=>{
        res.sendFile(__dirname + "/cowerker.html");
});



//Save new user to the user json file
//This method triggered when click event happen
app.post('/add-user',urlencodedParser,(req,res,err)=>{	
	userObj.user.push({
		name:req.body.name,
		email:req.body.email,
		telephone:req.body.telephone,
		usertype:req.body.usertype,
		pass:req.body.pass
	});	
	
	//redirect to login page
	res.redirect('/login');

	 //Covert data to JSON
        const data=JSON.stringify(userObj,null,2);
        fs.writeFileSync('user_file.json',data);
 	
	console.log("Registered");
	res.end();
});

//log in
app.post('/auth',urlencodedParser,(req,res,err)=>{
	var email=req.body.email;
	var pass=req.body.password;
	var usertype=req.body.usertype;
	
	var size=userObj.user.length;
	
	console.log("users %d",size);
	
	for(var i=0;i<size;i++){
		var email_obj=pass=userObj.user[i].email;
		var pass_obj=pass=userObj.user[i].pass;
		var usertype_obj=userObj.user[i].usertype;
		if((email==email_obj && pass==pass_obj && usertype==usertype_obj) && usertype_obj=="owner"){
			console.log(`user ${userObj.user[i].name} is found`);
			res.redirect('/owner');
		}
		if((email==email_obj && pass==pass_obj && usertype==usertype_obj) && usertype_obj=="user"){
			console.log(`user ${userObj.user.name} is found`);
                        res.redirect('/coworker');
		}
	}
});

//Add property
app.post('/add-prop', urlencodedParser, (req,res,err)=>{
	propObj.property.push({
		pname:req.body.pname,
		street:req.body.street,
		city:req.body.city,
		workspace:req.body.workspace,
		price:req.body.price
	});
	// Covert data to JSON
        const data=JSON.stringify(propObj,null,2);
        fs.writeFile('prop_file.json',data,function(err){
        
		var props=propObj.property;
                //res.send(props);

               //log the update to the console
                console.log("property added sucessfully");
       });
	res.redirect('/props');

});

app.get('/props', (req,res)=>{
	var data=propObj.property;
	res.send(data);
});

app.get('/remove',(req,res)=>{
	res.sendFile(__dirname+"/delete.html");
});


app.post('/search',urlencodedParser,search);
function search(req,res,err){
        var city=req.body.city;
        
	console.log(city);

	var size=propObj.property.length;
	var result={"property":[]}

        for(var i=0;i<size;i++){
                var city_obj=propObj.property[i].city;
              
                if(city==city_obj){
			result.property.push({
				pname:propObj.property[i].pname,
				street:propObj.property[i].street,
				city:propObj.property[i].city,
				workspace:propObj.property[i].workspace,
				price:propObj.property[i].price
			});
		}
        }
	res.send(result.property);
}

app.post('/remove',urlencodedParser,remove);
function remove(req,res,err){
        var pname=req.body.pname;
        var size=propObj.property.length;

        for(var i=0;i<size;i++){
                var pname_obj=propObj.property[i].pname;

                if(pname==pname_obj){
			delete propObj.property[i]
                            
                      }
        }
	console.log(propObj.property);

	var data=JSON.stringify(propObj,null,2);
	fs.writeFileSync('prop_file.json',data);

        res.send(propObj.property);
}



//server
const PORT = 8081;
app.listen(PORT,()=>{
	console.log(`App Listening at port: ${PORT}`);
});
