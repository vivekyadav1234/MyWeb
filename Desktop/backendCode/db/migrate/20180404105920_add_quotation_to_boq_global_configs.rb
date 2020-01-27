class AddQuotationToBoqGlobalConfigs < ActiveRecord::Migration[5.0]
  def change
    add_reference :boq_global_configs, :quotation, index: true, foreign_key: true
  end
end
