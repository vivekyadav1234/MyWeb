class ChangeMaterialFinishHiddenDefaults < ActiveRecord::Migration[5.0]
  def change
    change_column_default :core_materials, :hidden, :true
    change_column_default :shutter_finishes, :hidden, :true
  end
end
