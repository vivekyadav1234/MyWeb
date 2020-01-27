class AddDiscountStatusToProposalDoc < ActiveRecord::Migration[5.0]
  def change
    add_column :proposal_docs, :discount_status, :string
  end
end
