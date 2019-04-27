import { DeleteResult, In, Like } from 'typeorm';
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

  // 이름 배열로 태그 검색
  async getByNames(names: string[], take: number, skip: number): Promise<[Tag[], number]> {
    const [tags, totalCount] = await this.tagRepository.findWithCount({ take, skip, where: { name: In(names) } });
    tags.sort((tag1, tag2) => names.indexOf(tag2.name) - names.indexOf(tag1.name));
    return [tags, totalCount];
  }

  // 이름 배열로 검색, 없는 경우 생성 후 반환
  async getOrCreateByNames(names: string[]): Promise<Tag[]> {
    const [results] = await this.getByNames(names, names.length, 0);
    for (let i = 0; i < names.length; i += 1) {
      const tag = results.find(res => res.name === names[i]);
      if (!tag) {
        results.push(await this.tagRepository.create({ name: names[i], description: '' }));
      }
    }
    results.sort((tag1, tag2) => names.indexOf(tag2.name) - names.indexOf(tag1.name));
    return results;
  }

  // Tag 내용 수정
  update(id: number, tag: Partial<Tag>): Promise<Tag> {
    return this.tagRepository.update(id, {
      description: tag.description,
    });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.tagRepository.delete(id);
  }

}
