import { Router, Request, Response } from "express";
import Answer from "../models/Answer";
import Question from "../models/Question";
import User from "../models/User";
import { authenticate } from "../middleware/auth";

const router = Router();

// TODO: POST /api/questions/:questionId/answers - Create answer (protected)
router.post(
  "/:questionId/answers",
  authenticate,
  async (req: Request, res: Response) => {
    // TODO: Get questionId from params
    const { questionId } = req.params;

    // TODO: Get body from req.body
    const { body } = req.body;

    // TODO: Validate body is provided
    if (!body) {
      return res.status(400).json({ error: "Body is required" });
    }
    // TODO: Check if question exists
    const question = await Question.findByPk(questionId);
    // If not found, return 404 "Question not found"
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // TODO: Create answer
    const answer = await Answer.create({
      body,
      questionId: Number(questionId),
      userId: req.user!.id,
    });

    // TODO: Fetch created answer with user info
    // Use findByPk with include
    const answerWithUser = await Answer.findByPk(answer.id, {
      include: [User],
    });

    // TODO: Return created answer
    res.json(answerWithUser);
  },
);

// TODO: PUT /api/answers/:id - Update answer (protected, owner only)
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  // TODO: Get id from params and body from req.body
  const { id } = req.params;
  const { body } = req.body;

  // TODO: Find answer
  // If not found, return 404
  const answer = await Answer.findByPk(id);
  if (!answer) {
    return res.status(404).json({ error: "Answer not found" });
  }

  // TODO: Check ownership
  // If not owner, return 403
  if (answer.userId !== req.user!.id) {
    return res
      .status(403)
      .json({ error: "Not authorized to update this answer" });
  }

  // TODO: Update answer
  await answer.update({ body });

  // TODO: Return updated answer
  res.json(answer);
});

// TODO: DELETE /api/answers/:id - Delete answer (protected, owner only)
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  // TODO: Find answer
  const answer = await Answer.findByPk(req.params.id);

  // TODO: Check ownership
  if (!answer || answer.userId !== req.user!.id) {
    return res
      .status(403)
      .json({ error: "Not authorized to delete this answer" });
  }

  // TODO: Delete answer
  await Answer.destroy();

  // TODO: Return success message
  res.json({ message: "Answer deleted successfully" });
});

export default router;
