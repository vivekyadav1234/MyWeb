class AddDescriptionToPortfolios < ActiveRecord::Migration[5.0]
  def change
    add_column :portfolios, :description, :text
  end
end
