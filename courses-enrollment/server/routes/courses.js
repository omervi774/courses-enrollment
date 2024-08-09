const fs = require('fs');
const express = require('express')
const app=express();
const Courses = require('../../models/courses1')

// variables
const dataPath = './server/data/courses.json';

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
            }
            if (!data) data="{}";
            callback(returnJson ? JSON.parse(data) : data);
       });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
            }

            callback();
        });
    };


module.exports = {
    //READ all courses
    read_courses: function (req, res) {
         Courses.find().then(users =>
             res.send(users)
         ).catch(e => res.status(500).send())

    //     fs.readFile(dataPath, 'utf8', (err, data) => {
    //         if (err) {
    //             res.sendStatus(500);                 
    //         }
    //         else
    //             res.send(!data? JSON.parse("{}") : JSON.parse(data));
    //     });
     },

    // return to clients spcific course 
    get_specific_course: function(req,res){
        // readFile(data=>{
        //     let courseId = req.params["id"];
        //     if (courseId[0] === ":") {
        //         courseId = courseId.slice(1)
        //     }
        //     //check if the course is in the database
        //     if(data[courseId]){
        //         res.status(200).send(data[courseId])
        //     }
        //     else{
        //         res.status(400).send("course not exist")
        //     }
        // },true)

        
        let courseId = req.params["id"];
        if (courseId[0] === ":")    {
                courseId = courseId.slice(1)
            }
        Courses.findById(courseId).populate('students_list.student').then(course =>{
            if(course && course.length !== 0 ){
                // course.students_list.forEach(Element=>{
                //     console.log(Element.student)
                // })

                res.status(200).send(course)        
            }
                
            else{  
                res.status(400).send("course not exist")    
            }
                    
        }).catch(e=>{res.status(400).send("course not exist")})


    },
  
    // CREATE course
   create_course: function (req, res) {
    
        console.log(req.body.id)
        Courses.find({id:req.body.id}).then(course =>{
            if(course && course.length !== 0 ){
                console.log(course)
                res.status(400).send("course already exist")        
            }
                
             else{
                    const course = new Courses(req.body)
                    course.save().then(user => {
                    console.log("in then - save");
                    res.status(200).send(user)
                    return
                    }).
            
                    catch(e => {
                        res.status(400).send(e)
                });

                    
                }
                    
                })
            
           
            },

        

        

        
        
    

        // readFile(data => {

        //     // no id sent
        //     if (!req.body.id) {
        //         res.status(400).send("no id sent")
        //         return
        //     }
        //     // this course already exists
        //     if(data[req.body.id]) {
        //         res.status(400).send("course already exist")
        //         return 
        //     }
        //      // one of the mendatory fileds not sent
        //     if(!req.body.name || !req.body.lecturer || !req.body.prerequisite_course || !req.body.start_date || !req.body.end_date){
        //         res.status(400).send("one of the mendatory fileds not sent")
        //         return
        //     }

        //     if(!req.body.students){
        //         req.body['students'] = {}
        //     }
            
        //     data[req.body.id] = req.body;
            
        //     // write new course to the file
        //     writeFile(JSON.stringify(data, null, 2), () => {
        //          res.status(200).send('new course added');
        //     });
        // },
        //     true);
    
    // UPDATE course
    update_course: function (req, res) {
        const updates = Object.keys(req.body)
         const allowedUpdates = ['name', 'lecturer', 'start_date', 'end_date']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
            let courseId = req.params["id"];
            if (courseId[0] === ":") {
                courseId = courseId.slice(1)
            }
        Courses.findByIdAndUpdate(courseId, {$set:req.body}, { new: true, runValidators: true }).then(course => {
            if (!course) {
                return res.status(404).send()
            }
            else {
                console.log(course)
                return res.status(200).send(course)
            }
        }).catch(e => res.status(400).send(e))

        
    },
    // DELETE course
    delete_course: function (req, res) {
        let courseId = req.params["id"];
            if (courseId[0] === ":") {
                courseId = courseId.slice(1)
            }
            Courses.findByIdAndDelete(courseId)
            .then(course => {
              if (course) {
                res.status(200).json(course); // Send the deleted course as the response
              } else {
                res.status(404).json({ message: 'Course not found' }); // Handle the case when course is not found
              }
            })
            .catch(e => res.status(400).send(e));

        // readFile(data => {
        //     let courseId = req.params["id"];
        //     if (courseId[0] === ":") {
        //         courseId = courseId.slice(1)
        //     }

        //     delete data[courseId];

        //     writeFile(JSON.stringify(data, null, 2), () => {
        //         res.status(200).send(`course id:${courseId} removed`);
        //     });
        // },
        //     true);
    }
};