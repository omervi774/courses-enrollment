const mongoose = require('mongoose')
const validator = require('validator')

var StudentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isNumeric(value)){
                throw new Error('id must contain only digits')
            }
        }
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
    },
    picture: {
        type: String,
        required: true,
        trim: true,
    },

    // grade: {
    //     type: Number,
    //     required: true,
    //     trim: true,
    //     validate(value) {
    //         if (value < 0 || value > 100) {
    //             throw new Error('grade must be between 0 to 100')
    //         }
    //     }
    // }
}, { timestamps: true }
);

const Students = mongoose.model('Students', StudentSchema);

module.exports = Students

