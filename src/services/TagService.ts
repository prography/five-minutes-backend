import { DeleteResult } from 'typeorm';
import { TagRepository } from '../repositories/TagRepository';

export class TagService {

  private tagRepository: TagRepository;

  constructor() {
    this.tagRepository = new TagRepository();
  }

  create() { }

  delete(id: number): Promise<DeleteResult> {
    return this.tagRepository.delete(id);
  }

}
