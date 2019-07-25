import { getCustomRepository } from 'typeorm';
import { Honor } from '../models/Honor';
import { HonorRepository } from '../repositories/HonorRepository';

export class HonorService {

  private honorRepository: HonorRepository;

  constructor() {
    this.honorRepository = getCustomRepository(HonorRepository);
  }

  public async create(name: string, mail: string, agreeReceivingMail: boolean, duration: number) {
    return this.honorRepository.save({
      name,
      mail,
      agreeReceivingMail,
      duration,
    });
  }

  public list() {
    return this.honorRepository.findAndCount();
  }

  public update(id: number, honor: Partial<Honor>) {
    return this.honorRepository.updateAndGet(id, honor);
  }

  public delete(id: number) {
    return this.honorRepository.delete(id);
  }
}
