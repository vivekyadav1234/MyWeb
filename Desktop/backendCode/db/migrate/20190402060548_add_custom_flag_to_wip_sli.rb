class AddCustomFlagToWipSli < ActiveRecord::Migration[5.0]
  def change
    add_column :wip_slis, :custom, :boolean
    add_column :wip_slis, :sli_type, :string
  end
end
