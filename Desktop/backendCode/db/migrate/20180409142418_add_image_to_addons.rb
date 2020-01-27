class AddImageToAddons < ActiveRecord::Migration[5.0]
  def change
    add_attachment :addons, :addon_image
  end
end
