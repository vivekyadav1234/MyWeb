class SegmentDetailedSerializer < CatalogSegmentSerializer
  attribute :categories

  def categories
    @catalog_type = instance_options[:catalog_type]
    object.catalog_categories.of_catalog_type(@catalog_type).map do |catalog_category|
      attr_hash = Hash.new
      attr_hash[:id] = catalog_category.id
      attr_hash[:category_name] = catalog_category.category_name
      attr_hash[:subcategories] = catalog_category.catalog_subcategories.
                                                  of_catalog_type(@catalog_type).map do |catalog_subcategory|
        {
          id: catalog_subcategory.id, 
          subcategory_name: catalog_subcategory.subcategory_name, 
          classes: catalog_subcategory.catalog_classes.of_catalog_type(@catalog_type).map{ |klass| klass.attributes.slice('id', 'name')}
        }
      end

      attr_hash
    end
  end
end
