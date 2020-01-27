class CreatePortfolioWorks < ActiveRecord::Migration[5.0]
  def change
    create_table :portfolio_works do |t|
      t.string :name
      t.text :description
      t.string :url
      t.attachment :attachment_file

      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
