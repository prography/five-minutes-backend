import { DeleteResult, Like } from 'typeorm';
import { TagUpdateDto } from '../Dto/TagUpdateDto';
import { Tag } from '../models/Tag';
import { TagRepository } from '../repositories/TagRepository';

export class TagService {

  private tagRepository: TagRepository;

  constructor() {
    this.tagRepository = new TagRepository();
  }

  create(name : string, description: string): Promise<Tag> {
    const newTag = new Tag();
    newTag.name = name;
    newTag.description = description;
    return this.tagRepository.create(newTag);
  }

  getTags(take: number, skip: number): Promise<[Tag[], number]> {
    return this.tagRepository.findWithCount({ take, skip });
  }

  // Tag 검색
  getByName(name: string, take: number, skip: number): Promise<[Tag[], number]> {
    return this.tagRepository.findWithCount({ take, skip, where: { name: Like(`${name}%`) } });
  }

  // Tag 수정
  update(id: number, tag: TagUpdateDto): Promise<Tag> {
    return this.tagRepository.update(id, {
      description: tag.description,
    });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.tagRepository.delete(id);
  }

}
