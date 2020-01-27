class Api::V1::CommentsController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :set_comment, only: [:show, :update, :destroy]
  before_action :set_commentable
  load_and_authorize_resource :project
  load_and_authorize_resource :comment, :through => :project

  # GET /api/v1/comments
  def index
    @comments = @commentable.comments.reverse
    render json: @comments
  end

  # GET /api/v1/comments/1
  def show
    render json: @comment
  end

  # POST /api/v1/comments
  def create
    @comment = @commentable.comments.build(comment_params)
    @comment.user_id = current_user.id
    if @comment.save
      render json: @comment, status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/comments/1
  def update
    if @comment.update(comment_params)
      render json: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/comments/1
  def destroy
    @comment.destroy
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
  end

  def set_commentable
    @commentable = params[:commentable_type].constantize.find(params[:commentable_id])
  end
  
  # Only allow a trusted parameter "white list" through.
  def comment_params
    # params.fetch(:comment, {})
    params.except(:project_id).require(:comment).permit(:body, :comment_for, :commentable_id, :commentable_type, :user_id)
  end
end
