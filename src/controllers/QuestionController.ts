import { Request, Response } from 'express';
import { QuestionService } from '../services/QuestionService';

export class QuestionController  {
  create(_: Request, res: Response) {
    res.send({
      data: 'sample',
    });
  }

  update(_: Request, res: Response) {
    res.send({
      data: 'sample',
    });
  }

  async get(req: Request, res: Response) {
    const questionService = new QuestionService();
    const sample = await questionService.getQuestion(Number(req.params.sample));
    res.send({
      result: sample,
    });
  }
}
