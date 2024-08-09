const express = require('express'),
    coursesRoutes = require('./courses');
    studentsRoutes = require('./students');
    

var router = express.Router();

/// all routes we take care of
router.get('/courses', coursesRoutes.read_courses);
router.post('/courses', coursesRoutes.create_course);
router.put('/courses/:id', coursesRoutes.update_course);
router.delete('/courses/:id', coursesRoutes.delete_course);
router.get('/courses/:id',coursesRoutes.get_specific_course);

router.post('/courses/:courseId',studentsRoutes.add_student);
router.post('/students',studentsRoutes.add_student1);
router.delete('/courses/:courseId/:studentId',studentsRoutes.delete_student);
router.get('/students/:studentId',studentsRoutes.get_student_name);

module.exports = router;