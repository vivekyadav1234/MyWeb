class AddAllowedInCustomUnitToAddons < ActiveRecord::Migration[5.0]
  def change
    add_column :addons, :allowed_in_custom_unit, :boolean, default: false
  end
end
