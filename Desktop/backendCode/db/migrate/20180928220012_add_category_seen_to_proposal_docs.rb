class AddCategorySeenToProposalDocs < ActiveRecord::Migration[5.0]
  def change
    add_column :proposal_docs, :seen_by_category, :boolean, default: false
  end
end
