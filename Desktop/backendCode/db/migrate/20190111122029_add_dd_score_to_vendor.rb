class AddDdScoreToVendor < ActiveRecord::Migration[5.0]
  def change
    add_column :vendors, :dd_score, :float
  end
end
