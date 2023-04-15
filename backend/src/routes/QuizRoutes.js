const router = require("express").Router()

const QuizController = require("../controllers/QuizController")

const verifyToken = require("../helpers/verify-token")


router.post('/create',verifyToken, QuizController.create)
router.get('/', QuizController.getAll)
router.get('/myQuiz',verifyToken, QuizController.getAllUserQuiz)
router.get('/:id', QuizController.getQuizById)
router.delete('/:id',verifyToken, QuizController.removeQuizById)
router.patch('/addQuestion/:id', verifyToken, QuizController.addQuestion)


module.exports = router