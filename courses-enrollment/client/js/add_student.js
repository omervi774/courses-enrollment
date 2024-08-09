// when document ready put validation rules and ajax call for adding student
$(document).ready(function () {
    //  var urlParams = new URLSearchParams(window.location.search);
    //  var courseId = urlParams.get('courseId');
    
    $("form[name='add-student']").validate({
        // Specify validation rules
        rules: {
          "student_id":{
            digits:true
          },
          "studentName": {
            minlength: 2
          },
          "surname":{
            minlength: 2
          },
          // "grade":{
          //   digits:true,
          //   min: 0,
          //   max: 100
          // },
          "url": {
            url: true // Added URL validation rule
          }
        },
        // Specify validation error messages
        messages: {       
          student_id: "please enter only digits",
          studentName: "Your name must be at least 3 characters long",
          surname:"Your surname must be at least 3 characters long",
          // grade:"Please enter only digits between 0 -100",
          url: "Please enter a valid URL"
        }
      });

    // process the form
    $('#add-student').submit(function (event) {
        if(!$("#add-student").valid()) 
          return;
        
        // process the form
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            // url: `http://localhost:3001/courses/${courseId}`, // the url where we want to POST
             url: `http://localhost:3001/students`, // the url where we want to POST

            contentType: 'application/json',
            data: JSON.stringify({
                "id" : $("#student_id").val(),
                "firstname":$("#studentName").val(),
                "surname":$("#surname").val(),
                "picture":$("#url").val(),
                // "grade":$("#grade").val()
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
              
              // Handle the specific error messages received from the server
              if (errorMessage === "student already exists") {
                // Display appropriate message or take necessary action
                alert("student already exists")
              } else if (errorMessage === "grade must be between 0 to 100") {
                // Display appropriate message or take necessary action
                alert("the grade must to be number between 0-100")
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
