class AddRemarkToProposalDoc < ActiveRecord::Migration[5.0]
  def change
    add_column :proposal_docs, :remark, :text
  end
end
