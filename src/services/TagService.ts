import { DeleteResult } from 'typeorm';
import { Tag } from '../models/Tag';
import { TagRepository } from '../repositories/TagRepository';

export class TagService {

  private tagRepository: TagRepository;

  constructor() {
    this.tagRepository = new TagRepository();
  }

  create(tag: Tag): Promise<Tag> {
    const newTag = new Tag();
    newTag.name = tag.name;
    newTag.description = tag.description;
    return this.tagRepository.create(newTag);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.tagRepository.delete(id);
  }

}
