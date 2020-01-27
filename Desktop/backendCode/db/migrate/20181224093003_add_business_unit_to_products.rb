class AddBusinessUnitToProducts < ActiveRecord::Migration[5.0]
  def change
    add_reference :products, :business_unit, index: true, foreign_key: true
  end
end
