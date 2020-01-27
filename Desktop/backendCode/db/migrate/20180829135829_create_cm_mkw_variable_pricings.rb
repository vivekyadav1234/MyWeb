class CreateCmMkwVariablePricings < ActiveRecord::Migration[5.0]
  def change
    create_table :cm_mkw_variable_pricings do |t|
      t.json :full_home_factors, null: false, default: {}
      t.json :mkw_factors, null: false, default: {}

      t.references :cm, index: true, foreign_key: { to_table: :users }
    end
  end
end
