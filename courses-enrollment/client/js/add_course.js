// when document ready put validation rules and ajax call for adding course
$(document).ready(function () {
    
  $.validator.addMethod("commaSeparatedWords", function(value, element) {
    // Split the value by commas
    var words = value.split(",");
  
    // Trim each word and check if it contains any spaces
    for (var i = 0; i < words.length; i++) {
      var word = words[i].trim();
      if (word.includes(" ")) {
        return false; // Word contains space, validation fails
      }
    }
  
    return true; // All words are separated by commas
  }, "Please separate each word with a comma (,) and avoid spaces.");

  $.validator.addMethod("IdCourse", function(value, element) {
    for (var i = 0; i < value.length; i++) {
      var char = value.charAt(i);
      if (!(char >= 'a' && char <= 'z') && !(char >= 'A' && char <= 'Z') && !(char >= '0' && char <= '9')) {
        return false;
      }
    }
    return true;
  }, "ID of course can to be only digits and characters A-Z");
      
  $("form[name='add-course']").validate({
      // Specify validation rules
      rules: {
        "course_id":{
          IdCourse: true,
          minlength: 1
        },
        "courseName": {
          minlength: 1
        },
        "lecturerName":{
          minlength: 1
        },
        // "prerequisite_course":{
        //   commaSeparatedWords:true
        
        // },
        "start_date":{
          "date":true
        },
        "end_date":{
          "date":true
        }
        
      },
      // Specify validation error messages
      messages: {       
        course_id: "ID of course can to be only digits and characters A-Z",
        courseName: "course name must be at least 3 characters long",
        lecturerName:"Your surname must be at least 3 characters long",
        prerequisite_course: "Please separate each word with a comma (,) and avoid spaces.",
        start_date:"this filed is required",
        end_date:"this filed is required"
        
      }
    });

  // process the form
  try{
    $('#add-course').submit(function (event) {
        if(!$("#add-course").valid()) 
          return;

          // let prerequisiteArr = $("#prerequisite_course").val().split(",");
        
        // process the form
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: "/courses", // the url where we want to POST
            contentType: 'application/json',
            data: JSON.stringify({

                "id" : $("#course_id").val(),
                "name":$("#courseName").val(),
                "lecturer":$("#lecturerName").val(),
                "start_date":$("#start_date").val(),
                "end_date":$("#end_date").val(),
                // "prerequisite_course" : prerequisiteArr,
            }
            ),
            processData: false,            
            // dataType: 'json', // what type of data do we expect back from the server
            encode: true,
            success: function( data, textStatus, jQxhr ){
            },
            error: function( jqXhr, textStatus, errorThrown ){
              var errorMessage = jqXhr.responseText;
              // Handle the specific error messages received from the server
              if (errorMessage === "course already exist") {
                // Display appropriate message or take necessary action
                alert("course already exist")
              }
            }
        })
    });
  }
  catch{ }
});
