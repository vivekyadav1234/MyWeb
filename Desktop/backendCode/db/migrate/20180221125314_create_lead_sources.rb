class CreateLeadSources < ActiveRecord::Migration[5.0]
  def change
    rename_column :leads, :lead_source, :lead_source_temp

    create_table :lead_sources do |t|
      t.string :name

      t.timestamps
    end

    add_reference :leads, :lead_source, index: true, foreign_key: true
  end
end
