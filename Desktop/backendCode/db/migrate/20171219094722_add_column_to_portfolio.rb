class AddColumnToPortfolio < ActiveRecord::Migration[5.0]
  def change
    add_column :portfolios, :portfolio_data, :json
  end
end