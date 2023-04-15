
const createUserToken = require('../helpers/create-user-token')
const User = require('../models/User')

module.exports  = class UserController {

    static async register(req, res) {

        const { name, cpf, password, confirmPassword} = req.body

        //validations
        if(!name){
            return res.status(422).json({ message: "O Campo nome é obrigatorio!"})
        }
        if(!cpf){
            return res.status(422).json({ message: "O Campo cpf é obrigatorio!"})
        }
        if(!password){
            return res.status(422).json({ message: "O Campo da senha é obrigatorio!"})
        }
        if(password !== confirmPassword){
            return res.status(422).json({ message: "Senhas não coincidem!"})
        }
        
        //check if user exists
        const userExists = await User.findOne({cpf: cpf})
        if(userExists){
            return res.status(422).json({ message: "Já existe uma conta com esse cpf!"})
        }

        //criptografar a senha
        const hash = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            cpf,
            password: hash
        })

        try {
            const newUser = await  user.save()

            return await createUserToken(newUser, req, res)
        } catch (error) {
            return res.status(500).json({ message: error})
        } 
    }

    static async login (req, res) {

        const { cpf, password } = req.body

        if(!cpf){
            return res.status(422).json({ message: "O Campo cpf é obrigatorio!"})
        }
        if(!password){
            return res.status(422).json({ message: "O Campo da senha é obrigatorio!"})
        }

        //check if user exists
        const user = await User.findOne({cpf: cpf})
        if(user){
            return res.status(422).json({ message: "Já existe uma conta com esse cpf!"})
        }

        //check se password match                (senha recebida com senha do usuario cadastrado no abnco)
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(422).json({ message: "Senha inválida!!"})
        }

        return await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {
        let currentUser
        
        if(req.headers.authorization){
            const token = getToken(req)
            const decoded = jwt.verify(token, 'secret',)

            currentUser = await User.findById(decoded.id).select("-password")
        }else{
            currentUser = null
        }
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        try{
            const user = await User.findById(id).select("-password")
            res.status(200).json({user});

        }catch (error){
            return res.status(422).json({message: 'Usuário não encontrado!'})

        }
    }

    static async editUser(req, res) {
        const { name, cpf, password, confirmPassword} = req.body

        //check if user exist
        const token = getToken(req)
        const user = await getUserByToken(token)
        
         //validations
         if(!name){
            return res.status(422).json({ message: "O Campo nome é obrigatorio!"})
        }
        if(!cpf){
            return res.status(422).json({ message: "O Campo cpf é obrigatorio!"})
        }
        if(password !== confirmPassword){
            return res.status(422).json({ message: "Senhas não coincidem!"})

        }else if( password !== confirmPassword && password != null){
            //caso ele nao queria atualizar a senha
            const hash = await bcrypt.hash(password, 10)
            user.password = hash
        }

        //check if user exists
        const userExists = await User.findOne({cpf: cpf})
        if(userExists){
            return res.status(422).json({ message: "Já existe uma conta com esse cpf!"})
        }
        
        user.cpf = cpf
        user.name = name
        try {
            
            const updatedUser = await User.findOneAndUpdate(
                { _id:user._id },
                { $set: user },
                { new: true }
            )

            return res.status(200).json({message: "Usuario atualizado", user: updatedUser})
        } catch (err) {
            return res.status(500).json({message: err})
        }
    }

}