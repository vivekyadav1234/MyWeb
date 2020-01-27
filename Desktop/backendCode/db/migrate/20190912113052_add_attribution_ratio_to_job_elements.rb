class AddAttributionRatioToJobElements < ActiveRecord::Migration[5.0]
  def change
    add_column :job_elements, :attribution_ratio, :float
  end
end
