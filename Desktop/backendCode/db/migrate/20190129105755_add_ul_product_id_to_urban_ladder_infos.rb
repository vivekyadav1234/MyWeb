class AddUlProductIdToUrbanLadderInfos < ActiveRecord::Migration[5.0]
  def change
    add_column :urban_ladder_infos, :ul_product_id, :integer
  end
end
