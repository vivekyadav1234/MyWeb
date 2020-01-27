class CreateBomSliCuttingListMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :bom_sli_cutting_list_mappings do |t|
      t.string :program_code, null: false
      t.string :sli_group_code, null: false

      t.timestamps
    end

    add_index :bom_sli_cutting_list_mappings, :program_code, unique: true
  end
end
