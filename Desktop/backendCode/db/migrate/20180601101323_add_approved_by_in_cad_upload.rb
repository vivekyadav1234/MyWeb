class AddApprovedByInCadUpload < ActiveRecord::Migration[5.0]
  def change
    add_reference :cad_uploads, :approved_by, foreign_key: { to_table: :users }, index: true
  end
end
