class CreateLeads < ActiveRecord::Migration[5.0]
  def change
    create_table :leads do |t|
      t.string :name
      t.string :email
      t.string :contact
      t.text :address
      t.text :details

      t.timestamps
    end
  end
end
