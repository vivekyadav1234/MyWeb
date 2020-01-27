class AddImosTypeToJobElements < ActiveRecord::Migration[5.0]
  def change
    add_column :job_elements, :imos_type, :string
  end
end
