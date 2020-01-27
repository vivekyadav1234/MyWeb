class AddMasterDataInfoAndQuantityToJobElements < ActiveRecord::Migration[5.0]
  def change
    add_reference :job_elements, :vendor_product, index: true, foreign_key: true
    add_column :job_elements, :quantity, :float
    add_column :job_elements, :unit, :string
  end
end
