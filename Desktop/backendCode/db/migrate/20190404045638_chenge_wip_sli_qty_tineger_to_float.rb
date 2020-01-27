class ChengeWipSliQtyTinegerToFloat < ActiveRecord::Migration[5.0]
  def change
    change_column :wip_slis, :quantity,:float, default: 0
  end
end
