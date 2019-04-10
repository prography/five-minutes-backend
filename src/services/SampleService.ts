import { SampleRepository } from '../repositories/SampleRepository';
export class SampleService {

  private sampleRepository: SampleRepository;

  constructor() {
    this.sampleRepository = new SampleRepository();
  }

  findById(id: number) {
    this.sampleRepository.findById(id);
  }
}