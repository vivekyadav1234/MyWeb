class AddUserConsernToProposalDoc < ActiveRecord::Migration[5.0]
  def change
    add_column :proposal_docs, :user_concern, :boolean
  end
end
