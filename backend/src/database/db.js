const mongoose = require("mongoose")

const db_conection = process.env.DB_URL

mongoose.connect(db_conection)
    .then(console.log("Conectado ao banco de dados"))
    .catch((error)=>{
    console.log("Erro na conexão com o banco de dados")
    console.log(error)
})

module.exports = mongoose