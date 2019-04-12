import { Comment } from '../models/Comment';
import { CommentRepository } from '../repositories/CommentRepository';

export class CommentService {

  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  create(comment: Comment): Promise<Comment> {
    const newComment = new Comment();
    newComment.codeline = comment.codeline;
    newComment.content = comment.content;
    newComment.likedUsers = comment.likedUsers;
    newComment.question = comment.question;
    newComment.user = comment.user;
    return this.commentRepository.create(newComment);
  }

  update() { }

  delete() { }

  getCommentsByQuestionId() { }

  getLikedComments() { }

  getLikedUsers() { }

  likeComment() { }
}
