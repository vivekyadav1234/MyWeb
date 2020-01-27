class AddColumnIsInPipelineToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :is_in_pipeline, :boolean
  end
end
