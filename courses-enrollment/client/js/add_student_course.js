// when document ready put validation rules and ajax call for adding student
$(document).ready(function () {
      var urlParams = new URLSearchParams(window.location.search);
      var courseId = urlParams.get('courseId');
    
    $("form[name='add-student-course']").validate({
        // Specify validation rules
        rules: {
          "student_id":{
            
          },
          
          "grade":{
            digits:true,
            min: 0,
            max: 100
          },
          
        },
        // Specify validation error messages
        messages: {       
          grade:"Please enter only digits between 0 -100",
         
        }
      });

    // process the form
    $('#add-student-course').submit(function (event) {
        if(!$("#add-student-course").valid()) 
          return;
        
        // process the form
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: `http://localhost:3001/courses/${courseId}`, // the url where we want to POST
             

            contentType: 'application/json',
            data: JSON.stringify({
                "student" : $("#student_id").val(),
                "grade":$("#grade").val()
            }
            ),
            processData: false,            
            // dataType: 'json', // what type of data do we expect back from the server
            encode: true,
            success: function( data, textStatus, jQxhr ){
                window.location.href = "/list";
            },
            error: function( jqXhr, textStatus, errorThrown ){
              var errorMessage = jqXhr.responseText;
              //3window.location.href = "/list";
              
              // Handle the specific error messages received from the server
              if (errorMessage === "Student is already in the course") {
                // Display appropriate message or take necessary action
                alert("Student is already in the course")
              } else if (errorMessage === "grade must be equal to the student grade") {
                // Display appropriate message or take necessary action
                alert("grade must be equal to the student grade")
              } else if (errorMessage === "course not exists") {
                // Display appropriate message or take necessary action
                alert("course not exists")
              } else if (errorMessage === "id must contain only digits") {
                alert("ID of student must to be only digits")
              } else {
                // Handle any other error scenarios
              }
            }
        })
          
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

});
