class AddFinancialSolutionRequiredToNoteRecord < ActiveRecord::Migration[5.0]
  def change
    add_column :note_records, :financial_solution_required, :string
  end
end
