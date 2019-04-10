import { Request, Response } from 'express';
import { SampleService } from '../services/SampleService';

export class SampleController  {
  create(_: Request, res: Response) {
    res.send({
      data: 'sample',
    });
  }

  async get(req: Request, res: Response) {
    const sampleService = new SampleService();
    const sample = await sampleService.findById(Number(req.params.sample));
    res.send({
      result: sample,
    });
  }
}