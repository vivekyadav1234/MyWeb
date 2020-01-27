class AddTokenToDesignerProject < ActiveRecord::Migration[5.0]
  def change
    add_column :designer_projects, :mail_token, :string
    add_index :designer_projects, :mail_token, unique: true

    add_column :designer_projects, :token_uses_left, :integer, null: false, default: 0
  end
end
