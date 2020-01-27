class AddPdfPageCountToContents < ActiveRecord::Migration[5.0]
  def change
    add_column :contents, :pdf_page_count, :integer
  end
end
