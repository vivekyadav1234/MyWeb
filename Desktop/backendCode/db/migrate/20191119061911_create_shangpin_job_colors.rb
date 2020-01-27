class CreateShangpinJobColors < ActiveRecord::Migration[5.0]
  def change
    create_table :shangpin_job_colors do |t|
      t.string :color
      t.references :shangpin_core_material, foreign_key: true
      t.timestamps
    end
  end
end
