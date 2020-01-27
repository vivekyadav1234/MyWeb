class CreateLeadTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_types do |t|
      t.string :name

      t.timestamps
    end

    add_reference :leads, :lead_type, index: true, foreign_key: true
  end
end
