var express = require('express');
var app = express();
var dbConn = require('./config'); 
var bodyParser = require('body-parser');
var dateTime = require('node-datetime');
var dt = dateTime.create();
var curdate = dt.format('Y-m-d H:M:S');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 

 app.get('/', function (req, res) {
    console.log('hello world');
});
 
// Retrieve all students data
app.get('/students', function (req, res) {
    dbConn.query('SELECT * FROM students', function (err, results) {
		if(err) {
			throw err;
		} else {
			return res.send({ status: true, data: results});
		}
    });
});
 
 
// Retrieve the specific student data 
app.get('/student/:id', function (req, res) {
  
    let student_id = req.params.id;
  
    if(!student_id) {
        return res.status(400).send({ status: false, message: 'Please provide student id' });
    }
  
    dbConn.query('SELECT * FROM students where id=?', student_id, function (err, result) {
		if(err) {
			throw err;
		} else {
			return res.send({ status: true, data: result[0]});
		}
    });
  
});
 
 
// Add the student data
app.post('/student', function (req, res) {
  
  var student = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		mobile: req.body.mobile,
		created_at: curdate
	}
  
    if (!student) {
        return res.status(400).send({ status:false, message: 'Please Provide Student Data' });
    }
  
    dbConn.query("INSERT INTO students SET ? ", student, function (err, results) {
		if(err) {
			throw err;
		} else {
			return res.send({ status: true, data: results, message: 'New student has been created successfully.' });
		}
    });
});
 
 
// Update the student data
app.put('/student', function (req, res) {
  
    var student_id = req.body.id;
    var student = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		mobile: req.body.mobile,
		created_at: curdate
	}
  
    if (!student_id || !student) {
        return res.status(400).send({ status: false, message: 'Please provide student data and student id' });
    }
  
    dbConn.query("UPDATE students SET ? WHERE id = ?", [student, student_id], function (err, results) {
		if(err) {
			throw err;
		} else {
			return res.send({ status: true, data: results, message: 'Student has been updated successfully.' });
		}
    });
});
 
 
//  Delete the student data
app.delete('/student', function (req, res) {
  
    let student_id = req.body.id;
  
    if (!student_id) {
        return res.status(400).send({ status: false, message: 'Please provide student id' });
    }
    dbConn.query('DELETE FROM students WHERE id = ?', [student_id], function (err, results) {
		if(err) {
			throw err;
		} else {
			 return res.send({ status: true, data: results, message: 'Student has been deleted successfully.' });
		}       
    });
}); 
 
app.listen(3000, function(){
    console.log('Server running at port 3000: http://127.0.0.1:3000');
});