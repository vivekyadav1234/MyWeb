class AddPaperclipMetadata < ActiveRecord::Migration[5.0]
  def change
    add_column :portfolios, :attachment_file_meta, :text
  end
end
