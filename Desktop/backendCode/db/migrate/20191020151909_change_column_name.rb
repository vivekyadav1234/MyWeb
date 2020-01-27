class ChangeColumnName < ActiveRecord::Migration[5.0]
  def change
    rename_column :building_crawler_details, :type, :bhk_type
  end
end
