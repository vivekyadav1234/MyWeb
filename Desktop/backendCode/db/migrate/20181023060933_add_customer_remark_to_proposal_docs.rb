class AddCustomerRemarkToProposalDocs < ActiveRecord::Migration[5.0]
  def change
  	add_column :proposal_docs, :customer_remark, :text
  end
end
