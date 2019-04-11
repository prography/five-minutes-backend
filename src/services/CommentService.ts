import { CommentRepository } from '../repositories/CommentRepository';

export class CommentService {

  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  create() { }

  update() { }

  delete() { }

  getCommentsByQuestionId() { }

  getLikedComments() { }

  getLikedUsers() { }

  likeComment() { }
}
