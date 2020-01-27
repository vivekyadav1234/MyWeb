class AddLifestageToPortfolios < ActiveRecord::Migration[5.0]
  def self.up
    change_table :portfolios do |t|
      t.string :lifestage
      t.string :element
    end
  end

  def self.down
    remove_column :portfolios, :lifestage, :string
    remove_column :portfolios, :element, :string
  end
end
