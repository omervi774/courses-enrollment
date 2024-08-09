
/// call to get_courses when document is ready
$(document).ready(function () {
  get_courses()
});

/// cleen the div1 and fill it with ours course details in result
function create_course_list(result){
  $("#div1").empty()
  // create list of the courses 
  str = '';
  $.each(result, function (index, value) {
    str+= '<div class="course">'
    str += "<li class = visible>" + value._id  +"</li>"
    str += "<li>" + value.id  +"</li>"
      +"<li> name:&nbsp" + value.name +"</li>"
      + "<li> lecturer:&nbsp" + value.lecturer +"</li>"
      + "<li>  start_date:&nbsp " + value.start_date +"</li>"
      + "<li>  end_date:&nbsp " + value.end_date; + "</li>"

    // str+= "<li>prerequisite_course list:\n"
    // str += "<ul>";
    // // for each course create list of prerequisite courses
    // value.prerequisite_course.forEach(element => {
    //   str+= "<li>"  + element  +"</li>";
    // });
    // str += "</ul> </li>";

    //checks if this course has student list and if it does create list of the students
    
   
    if(value.students_list.length > 0){
      str+="<li>student list:\n"
      str += "<ul>";

      value.students_list.forEach(element=> {
          console.log("sagi")
          $.ajax({
            url: `/students/${element.student}`,
            async: false,
            success: function (result) {
              str += "<li>" + result +", " + element.grade  +"</li>"
              str += "<br>"
              console.log("omer2")
              
            },
            error: function (err) {
              str += "<li >" + element.student + ", "+ element.grade  +"</li>"
              str += "<br>"
            }
          });

      
        
        // str += "<li >" + element.grade  +"</li>"
        
        
      });

      str += '</ul> </li>';
    }
    
    
     //str += "</li>";

    // creating button for delete,upadte,add studen,etc for each course
    str += '<button class="delete">delete course</button>'
    str += '<button class="add-student-course">add student to course</button>'
    str += '<button class="edit">edit course details</button>'
    str += '<button class="see-students">see students list</button>'
    str+= '</div>'
  });

  str += '';
  
  $("#div1").html(str);
}



function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// ajax call to get all the courses, call to create_course_list to create the list of courses
function get_courses() {
  $.ajax({
    url: "/courses",
    success: function (result) {
      create_course_list(result)
    },
    error: function (err) {
    }
  });
}


// when the user press on delete button, ajax call to delete the specific course
$(document).on("click", ".delete", function() {
  let courseId = $(this).closest("div").find("li:first").text().trim();
  $.ajax({
    type: 'DELETE',
    url: `/courses/${courseId}`, 
    success: function( data, textStatus, jQxhr ){
        get_courses()
      
    },
    error: function( jqXhr, textStatus, errorThrown ){
    }
})
  
});


// when user click on edit course route to html form to edit the course details
$(document).on("click", ".edit", function() {
  var courseId = $(this).closest("div").find("li:first").text().trim();
  console.log(courseId)
  window.location.href = "/edit_course?courseId=" + courseId;
});

// when user click on add student route to html form to add student
$(document).on("click", ".add-student", function() {
  var courseId = $(this).closest("div").find("li:first").text().trim();
  window.location.href = "/add_student?courseId=" + courseId;
    // window.location.href = "/add_student"
   

});

$(document).on("click", ".add-student-course", function() {
  var courseId = $(this).closest("div").find("li:first").text().trim();
  window.location.href = "/add_student_course?courseId=" + courseId;
    // window.location.href = "/add_student"
   

});

// when user click on add course route to html form to add_course
$(document).on("click", ".add-course", function() {
  
  window.location.href = "/add_course";
  
});


//Dislpays list of student
$(document).on("click", ".see-students", function() {
  let courseId = $(this).closest("div").find("li:first").text().trim();
  //ajax call to get the specific course
  $.ajax({
    url: `/courses/${courseId}`,
    success: function(result) {
     
     let students_list = "<ul>";
   
     result.students_list.forEach(value=>{
        students_list += '<div>';
        students_list += "<li class = visible>" + value.student._id + "</li>"
        students_list += "<li>" + value.student.id + "</li>" +
          "<li> name:&nbsp" + value.student.firstname + "</li>" +
          "<li> surname:&nbsp" + value.student.surname + "</li>" +
          `<li> picture:&nbsp <img src="${value.student.picture}" width=50 heigth=50> </li>` +
          "<li> grade:&nbsp " + value.grade + "</li>";
        students_list += '<button class="delete-student">delete student</button>';
        students_list += '</div>';
     })
     students_list += "</ul>"

      // for each student - add student to the list
      // $.each(result.students_list, function(index, value) {
      //   students_list += '<div>';
      //   students_list += "<li>" + value.id + "</li>" +
      //     "<li> name:&nbsp" + value.firstname + "</li>" +
      //     "<li> surname:&nbsp" + value.surname + "</li>" +
      //     `<li> picture:&nbsp <img src="${value.picture}" width=50 heigth=50> </li>` +
      //     "<li> grade:&nbsp " + value.grade + "</li>";
      //   students_list += '<button class="delete-student">delete student</button>';
      //   students_list += '</div>';
      // });

      // students_list += "</ul>";

      /// create the popup screen with the students list
      Swal.fire({
        title: `Students Details of course ${courseId}`,
        html: `${students_list !== "<ul></ul>" ? students_list : "No students in this course"}`,
        didOpen: function() {
          attachDeleteStudentListener(courseId); // Attach event listener here
        }
      });
    },
    error: function(err) {
    }
  });
});



/// when usere press on the delete button to delete student,we delete the specific student from the specific course
function attachDeleteStudentListener(courseId) {
  $(document).on("click", ".delete-student", function() {
    let studentId = $(this).closest("div").find("li:first").text().trim();


    $.ajax({
      type: 'DELETE', 
      url: `/courses/${courseId}/${studentId}`, 
      success: function( data, textStatus, jQxhr ){

        window.location.href = "/list";
          
        
      },
      error: function( jqXhr, textStatus, errorThrown ){
      }
  })
    
    
  });
}

