class AddLeadIdToWipPo < ActiveRecord::Migration[5.0]
  def change
    add_reference :po_wip_orders, :lead, foreign_key: true
  end
end
