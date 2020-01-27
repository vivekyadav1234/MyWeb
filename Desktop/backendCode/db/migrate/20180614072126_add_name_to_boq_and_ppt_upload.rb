class AddNameToBoqAndPptUpload < ActiveRecord::Migration[5.0]
  def change
    add_column :boq_and_ppt_uploads, :name, :string
  end
end
