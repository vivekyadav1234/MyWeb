class AddPriceToUrbanLadderInfos < ActiveRecord::Migration[5.0]
  def change
    add_column :urban_ladder_infos, :price, :float
  end
end
