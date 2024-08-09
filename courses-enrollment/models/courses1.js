const mongoose = require('mongoose');
const id_validator = require('mongoose-id-validator');
const validator = require('validator')


var CourseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
        if(!validator.isAlphanumeric(value)){
            throw new Error('id must contain only digits or letters')
        }
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  lecturer: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: String,
    required: true,
    trim: true
  },
  end_date: {
    type: String,
    required: true,
    trim: true
  },
  students_list: [{
    
    student: 
    { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Students', required: true 
    },
    grade:
    {
        type: Number,
        required: true,
        trim: true,
        validate(value){
          if(value < 0 || value > 100){
            throw new Error('grade must be between 0-100')
          }
        }
    }
  }],
}, { timestamps: true });
//CourseSchema.plugin(id_validator);
//TaskSchema.index("completed");

const Courses = mongoose.model('Courses', CourseSchema);

module.exports = Courses;