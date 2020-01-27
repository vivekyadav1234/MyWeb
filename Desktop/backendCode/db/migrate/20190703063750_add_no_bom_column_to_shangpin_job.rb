class AddNoBomColumnToShangpinJob < ActiveRecord::Migration[5.0]
  def change
    add_column :shangpin_jobs, :no_bom, :boolean, default: false, null: false
  end
end
