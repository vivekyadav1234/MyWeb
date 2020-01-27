class CreateBomSliCuttingListData < ActiveRecord::Migration[5.0]
  def change
    create_table :bom_sli_cutting_list_data do |t|
    	t.string :sheet, null: false
    	t.integer :row, null: false
    	t.string :sr_no
    	t.string :article_code
    	t.string :article_name
    	t.string :part_name
    	t.string :mat_top_lam_bottom
    	t.float :finish_length
    	t.float :finish_width
    	t.float :finish_height
    	t.float :finish_thk
    	t.float :qty
    	t.string :part_code
    	t.string :barcode1
    	t.string :barcode2
    	t.string :edge1
    	t.string :edge2
    	t.string :edge3
    	t.string :edge4
    	t.string :grain
    	t.string :cutting_length
    	t.string :cutting_width
    	t.string :cutting_thk
    	t.string :customer_name
    	t.string :part_material
    	t.string :laminate_top
    	t.string :laminate_bottom
    	t.string :size
    	t.float :edgeband_qty

    	t.references :boq_label, index: true, foreign_key: true

      t.timestamps
    end
  end
end
