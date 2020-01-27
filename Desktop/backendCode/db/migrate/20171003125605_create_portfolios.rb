class CreatePortfolios < ActiveRecord::Migration[5.0]
  def change
    create_table :portfolios do |t|
      t.string :space
      t.string :theme
      t.integer :price_cents, default: 0
      t.string :segment

      t.timestamps
    end
  end
end
