class AddTagToLeads < ActiveRecord::Migration[5.0]
  def change
    add_reference :leads, :tag, index: true

  end
end
