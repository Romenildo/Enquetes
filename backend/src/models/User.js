const mongoose = require("../database/db")

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        cpf: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    }, 
    { timestamps: true }
)

const User = mongoose.model("User", UserSchema)

module.exports = User
