class AddUniquenessConstrainstForNewCatalog < ActiveRecord::Migration[5.0]
  def change
    add_index :unit_segment_mappings, [:business_unit_id, :catalog_segment_id], unique: true, name: 'by_unit_segment'
    add_index :segment_category_mappings, [:catalog_segment_id, :catalog_category_id], unique: true, name: 'by_segment_category'
    add_index :category_subcategory_mappings, [:catalog_category_id, :catalog_subcategory_id], unique: true, name: 'by_category_subcategory'
    add_index :subcategory_class_mappings, [:catalog_subcategory_id, :catalog_class_id], unique: true, name: 'by_subcategory_class'

    add_index :unit_product_mappings, [:business_unit_id, :product_id], unique: true, name: 'by_unit_product'
    add_index :product_segments, [:product_id, :catalog_segment_id], unique: true, name: 'by_segment_product'
    add_index :product_categories, [:catalog_category_id, :product_id], unique: true, name: 'by_category_product'
    add_index :product_subcategories, [:catalog_subcategory_id, :product_id], unique: true, name: 'by_subcategory_product'
    add_index :product_classes, [:catalog_class_id, :product_id], unique: true, name: 'by_class_product'

    add_index :product_likes, [:product_id, :user_id], unique: true
  end
end
