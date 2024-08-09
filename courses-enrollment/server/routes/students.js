const fs = require('fs');
const dataPath = './server/data/courses.json';
const Students = require('../../models/students1')
const Courses = require('../../models/courses1');



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
    //add student
    add_student: function(req,res){
       

            // part2:
            let courseId = req.params["courseId"];
            
            if (courseId[0] === ":") {
                courseId = courseId.slice(1)
            }
            Courses.find().then(courses=>{
                let courseExists = false;
                
                courses.forEach(course=>{
                    
                    if(course._id.toString() === courseId){
                        courseExists = true;
                        let studentExists = false;
                       
                        course.students_list.forEach(element => {
                        console.log(element.student)
                        if(element.student.toString() === req.body.student){
                                studentExists = true;
                                return
                        }
                    });
                    if (studentExists) {
                        console.log("why")
                         return res.status(400).send("Student is already in the course");
                    }
                   
                    course.students_list.push({"student":req.body.student,"grade":req.body.grade})
                        

                         Courses.findByIdAndUpdate(courseId, {$set:{students_list:course.students_list,}}, { new: true, runValidators: true }).then(course => {
                            if (!course) {
                                console.log("hi")
                                return res.status(404).send()
                            }
                            else {
                                
                                return res.status(200).send(course)
                        }
                        }).catch(e => {
                            console.log("why2")
                            return res.status(400).send(e)
                        })
                }
                })
                if(!courseExists){
                    console.log("why1")
                    return res.status(400).send("course not exist")
                }

            }).catch(e=>{
                console.log("eitan")
                return res.status(400).send("course not exist")
            })

            


        
        
        

    },
    //delete student
    delete_student: function(req,res){

            let courseId = req.params["courseId"];
            if (courseId[0] === ":") {
                courseId = courseId.slice(1)
            }
            let studentId = req.params["studentId"];
            if (studentId[0] === ":") {
                studentId = studentId.slice(1)
            }
            console.log("student id : ",studentId)
            Courses.findById(courseId).then(course=>{
                if(course && course.length !== 0 ){
                    const student_arr = []
                    flag = 0
                    course.students_list.forEach(element=>{
                        

                        if(element.student.toString() !== studentId ){
                            student_arr.push(element)
                            
                        }
                        else{
                           flag = 1
                        }
                    })
                    if(flag === 0){
                        res.status(400).send("student is not in the course")
                        return
                    }

                    Courses.findByIdAndUpdate(courseId, {$set:{students_list:student_arr}}, { new: true, runValidators: true }).then(course => {
                        if (!course) {
                            return res.status(400).send()
                        }
                        else {
                            
                            return res.status(200).send(course)
                        }
                    }).catch(e => res.status(400).send(e))
                }
                else{
                    res.status(400).send("course does not exists")
                }

            }).
            catch(e=>{res.status(400).send("course does not exists")})


       
    },
    add_student1:function(req,res){
        const student = new Students(req.body)
        Students.find({"id":req.body.id}).then(stu=>{
            if(stu && stu.length !== 0 ){
                
                res.status(400).send("student already exists")        
            }
            else{
                student.save().then(user => {
                console.log("in then - save");
                res.status(200).send(user)
                }).catch(e => {
                        console.log("hello")
                        res.status(400).send(e)
                });
               
            }
            
        })
       
    },

    get_student_name:function(req,res){
        let studentId = req.params["studentId"];
        if (studentId[0] === ":") {
                studentId = studentId.slice(1)
        }
        Students.find().then(students=>{
            students.forEach(student=>{
                if(student._id.toString() === studentId){
                    return res.status(200).send(student.firstname)
                }
            })
            return res.status(400).send("student does not exists in the course")
        }).catch(e=>{ return res.status(500)})
    }
}