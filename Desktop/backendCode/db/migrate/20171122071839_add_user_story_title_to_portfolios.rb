class AddUserStoryTitleToPortfolios < ActiveRecord::Migration[5.0]
  def change
    add_column :portfolios, :user_story_title, :string
  end
end
