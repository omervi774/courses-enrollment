const express = require('express')
    require('./db/mongoose.js')
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    cors = require('cors'),
    
    routers = require('./server/routes/routes.js');
const port = 3001;



const app=express();

app.use('/list', express.static(path.join(__dirname, 'client/html/index.html')));
app.use('/edit_course', express.static(path.join(__dirname, 'client/html/edit_course.html')));
app.use('/add_student', express.static(path.join(__dirname, 'client/html/add_student.html')));
app.use('/add_course', express.static(path.join(__dirname, 'client/html/add_course.html')));
app.use('/add_student_course', express.static(path.join(__dirname, 'client/html/add_student_course.html')));

app.use('/student_list', express.static(path.join(__dirname, 'client/html/student_list.html')));

app.use('/js', express.static(path.join(__dirname, 'client/js')));


app.post('/add_course', function(req, res) {
        res.redirect('/list')
});

app.use('/css', express.static(path.join(__dirname, 'client/css')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routers);

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});