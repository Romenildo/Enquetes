const mongoose = require("mongoose")

const db_conection = process.env.DB_URL

mongoose.connect(db_conection).catch(()=>{
    console.lop("Erro na conexão com o banco de dados")
    console.log(error)
})

module.exports = mongoose