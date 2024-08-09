// when document ready put validation rules and ajax call for edit_course
$(document).ready(function () {
var urlParams = new URLSearchParams(window.location.search);
var courseId = urlParams.get('courseId');

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
   
    $("form[name='edit-course']").validate({
        // Specify validation rules
        rules: {
          "name":{
            minlength: 1
          },
          "lecturer_field": {
            digits: false,
            minlength: 1
          },
          "start_date":{
            "date":true
          },
          "end_date":{
            "date":true
          
          },
          "prerequisite_course":{
            commaSeparatedWords:true
          }
        },
        // Specify validation error messages
        messages: {       
          courseName: "Your name must be at least 5 characters long",
          lecturer_field: "Your name must be at least 3 characters long",
          start_date:"Please enter only digits",
          end_date:"Please enter only digits",
          prerequisite_course: "Please separate each word with a comma (,) and avoid spaces.",
        }
      });

    // process the form
    $('#edit-course').submit(function (event) {
        if(!$("#edit-course").valid()) {
          return;
        }

        let data = {}
        let courseName = $("#courseName").val();
        let lecturer_field = $("#lecturer_field").val();
        let start_date = $("#start_date").val();
        let end_date = $("#end_date").val();
        let prerequisite_course = $("#prerequisite_course").val();

        if(courseName){
          data.name = courseName
        }

        if(lecturer_field){
          data.lecturer = lecturer_field
        }

        if(start_date){
          data.start_date = start_date
        }

        if(end_date){
          data.end_date = end_date
        }

        if(prerequisite_course){
          var prerequisiteArr = prerequisite_course.split(",").map(function (word) {
            return word.trim();
          });
          data.prerequisite_course = prerequisiteArr;
        }
      
        // process the form
        $.ajax({
            type: 'PUT', // define the type of HTTP verb we want to use (PUT for our form)
            url: `http://localhost:3001/courses/:${courseId}`, // the url where we want to PUT
            contentType: 'application/json',
            data: JSON.stringify(
              data
            ),
            processData: false,            
            // dataType: 'json', // what type of data do we expect back from the server
            encode: true,
            success: function( data, textStatus, jQxhr ){
                window.location.href = "/list";
            },
            error: function( jqXhr, textStatus, errorThrown ){
            }
        })
        
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });
});
