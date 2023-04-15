const mongoose = require("../database/db")

const QuizSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        userOwner:Object, // quem criou o questionario
        questions:[{
            description:{
                type: String
            },
            user: Object,//quem amndou a question
            answers : [{
                description:{
                    type: String
                },
                user: Object,//quem amndou a question
            }]
        }]
    }, 
    { timestamps: true }
)

const Quiz = mongoose.model("Quiz", QuizSchema)

module.exports = Quiz
