class CreateGstNumbers < ActiveRecord::Migration[5.0]
  def change
    create_table :gst_numbers do |t|
      t.string :gst_reg_no
      t.references :ownerable, polymorphic: true
      t.timestamps
    end
  end
end
