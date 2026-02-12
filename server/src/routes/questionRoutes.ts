import { Router, Request, Response } from "express";
import { Question, User, Answer, Vote } from "../models";
import { authenticate } from "../middleware/auth";


const router = Router();

// TODO: GET /api/questions - Get all questions
router.get("/", async (req: Request, res: Response) => {
  const questions = await Question.findAll();
  // TODO: If no questions, return 204 with no body
  if (questions.length === 0) {
    return res.status(204).send();
  }
  // TODO: Return questions array
  res.json(questions);
});

// TODO: GET /api/questions/:id - Get single question with answers
router.get("/:id", async (req: Request, res: Response) => {
  // TODO: Get id from params                              
  const { id } = req.params;
  // TODO: Find question by id with User and Answers
  // Include Answer's User and Votes
  const question = await Question.findByPk(id, {
    include: [
     { model: Answer, as: "answers",
        include: [
          { model: User, as: "user" },
          { model: Vote, as: "votes"},
        ],
      }
      ]
       });
  
  
  // TODO: If not found, return 404 with message "Question not found"
  if (!question) {
    return res.status(404).send({ message: "Question not found" });
  }
 
  // TODO: Calculate vote counts for each answer
  // For each answer, sum up the vote values
  // Also include current user's vote if authenticated
  if (question.answers) {
    question.answers.forEach((answer: any) => {
      const votes = answer.votes ?? [];

      answer.voteCount = votes.reduce(
        (total: number, vote: Vote) => total + vote.value,
        0,
      );

     });
  }

  // TODO: Return question with answers
  res.json(question);
});

// TODO: POST /api/questions - Create new question (protected)
router.post("/", authenticate, async (req: Request, res: Response) => {
  // TODO: Get title and body from req.body
  const { title, body } = req.body;
  
  // TODO: Validate input (both required)
  if (!title ||!body) {
    return res.status(400).send({ message: "Title and body are required" });
  }

  // TODO: Check if user is authenticated
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  // TODO: Validate input length (title <= 100 characters, body <= 500 characters)
  if (title.length > 100 || body.length > 500) {
    return res.status(400).send({ message: "Input too long" });
  }
  // TODO: Create question with userId from req.user
   const question = await Question.create({
     title,
     body,
     userId: req.user!.id
   });
  // TODO: Fetch created question with user info
  // Use findByPk with include
  const questionWithUser = await Question.findByPk(question.id, {
    include: [{model: User, as: "user" }],
  });
  // TODO: Return created question
  res.json(questionWithUser);

});

// TODO: PUT /api/questions/:id - Update question (protected, owner only)
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  // TODO: Get id from params and title/body from body
  const { id } = req.params;
  const { title, body } = req.body;
  // TODO: Find question
  // If not found, return 404
  const question = await Question.findByPk(id);
  if (!question) {
    return res.status(404).send({ message: "Question not found" });
  }
  // TODO: Check if user owns this question
  
  if (question.userId!== req.user!.id) {
    return res.status(403).send({ message: "Not authorized" });
  }
  // TODO: Update question
   await question.update({ title, body });

  // TODO: Return updated question
  res.json(question);
});

// TODO: DELETE /api/questions/:id - Delete question (protected, owner only)
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  // TODO: Find question
  const { id } = req.params;
  const question = await Question.findByPk(id);
  if (!question) {
    return res.status(404).send({ message: "Question not found" });
  }
  // TODO: Check ownership
  if (question.userId!== req.user!.id) {
    return res.status(403).send({ message: "Not authorized" });
  }
   // TODO: Delete question
   await question.destroy();
  // TODO: Return success message
  res.send({ message: "Question deleted" });
});

export default router;
