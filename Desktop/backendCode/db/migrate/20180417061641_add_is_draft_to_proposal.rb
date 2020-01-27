class AddIsDraftToProposal < ActiveRecord::Migration[5.0]
  def change
    add_column :proposals, :is_draft, :string
  end
end
