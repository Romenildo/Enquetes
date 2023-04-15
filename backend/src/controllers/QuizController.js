
const Quiz = require('../models/quiz')

const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")

module.exports  = class QuizController {

    static async create (req, res){

        const {name, description} = req.body
        const date = new Date()

        if(!name){
            return res.status(422).json({message: "O campo nome é obrigatorio!"})
        }

        if(!description){
            return res.status(422).json({message: "O campo descrição é obrigatorio!"})
        }

        //get author
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a new quiz
        const quiz = new Quiz({
            name,
            description,
            date,
            userOwner:{
                _id: user._id,
                name: user.name
            }
        })

        try {
            const newQuiz = await quiz.save()
            return res.status(201).json({
                message: "Quiz criadfo com sucesso!",
                quiz: newQuiz
            })
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async getAll(req, res) {
        const quiz = await Quiz.find().sort("-createdAt");
        res.status(200).json({
          quiz: quiz,
        });
      }

    static async getAllUserQuiz(req, res) {

        //get user
        const token = getToken(req);
        const user = await getUserByToken(token);
    
        const quiz = await Quiz.find({ "userOwner._id": user._id }).sort("-createdAt");
        res.status(200).json({
          quiz: quiz,
        });
    }

    //get all quiz responses


    static async getQuizById(req, res) {
        const id = req.params.id;
    
        //check if id is valid
        if (!ObjectId.isValid(id)) {
          return res.status(422).json({ message: "Id invalido!" });
        }
    
        //check if quiz exists
        const quiz = await Quiz.findOne({ _id: id });
        if (!quiz) {
          return res.status(404).json({ message: "Pet não encontrado!" });
        }
    
        return res.status(200).json({
          quiz: quiz,
        });
    }

    static async removeQuizById(req, res) {
        const id = req.params.id;
    
        //check if id is valid
        if (!ObjectId.isValid(id)) {
          return res.status(422).json({ message: "Id invalido!" });
        }
    
        //check if pet exists
        const quiz = await Quiz.findOne({ _id: id });
        if (!quiz) {
          return res.status(404).json({ message: "Questionario não encontrado!" });
        }
    
        //check if logged in user registered the pet
        //get user
        const token = getToken(req);
        const user = await getUserByToken(token);
    
        if (quiz.userOwner._id.toString() !== user._id.toString()) {
          return res.status(422).json({ message: "Pet nao é do usuario logado!" });
        }
        //delete
        await Quiz.findByIdAndDelete(id);
    
        return res.status(200).json({ message: "Questionario deletado com sucesso" });
      }

      static async addQuestion(req, res){

        const id = req.params.id;
        const {description} = req.body

        if(!description){
            return res.status(422).json({message: "O campo descrição é obrigatorio!"})
        }

        //check if pet exists
        const quiz = await Quiz.findOne({ _id: id });
        if (!quiz) {
        return res.status(404).json({ message: "Quiz não encontrado!" });
        }

        //check if logged in user registered the pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        const question = new question({
            description,
            userOwner: {
              _id: user._id,
              name: user.name
            }
        })

        quiz.questions.push(question)

        await Quiz.findByIdAndUpdate(id, quiz);

        return res.status(200).json({ message: "Comentarioa dicionado!" });
      }
}