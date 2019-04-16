import { DeleteResult, Like } from 'typeorm';
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

  // Tag 검색
  getByName(name: string, take: number): Promise<[Tag[], number]> {
    return this.tagRepository.findWithCount({ take, where: { name: Like(name) } });
  }

  // Tag 수정
  update(id: number, tag: Partial<Tag>): Promise<Tag> {
    return this.tagRepository.update(id, {
      name: tag.name,
      description: tag.description,
    });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.tagRepository.delete(id);
  }

}
