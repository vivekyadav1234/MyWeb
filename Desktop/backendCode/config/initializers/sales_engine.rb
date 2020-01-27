# load the various prices, factors etc from the YAML file
MKW_GLOBAL_DATA = YAML.load_file Rails.root.join('app','data','mkw_global_data.yml')
MKW_GLOBAL_DATA_MODSPACE = YAML.load_file Rails.root.join('app','data','mkw_global_data_modspace.yml')
MKW_GLOBAL_DATA_ESTIMATED_COGS = YAML.load_file Rails.root.join('app','data','mkw_global_data_estimated_cogs.yml')

ARRIVAE_WEEKLY_STATISTICS_DATA = YAML.load_file Rails.root.join('app','data','arrivae_weekly_statistics.yml')

MODSPACE_EMAILS = ["kapil@arrivae.com", "anuradha@arrivae.com", "sarikakapoor@arrivae.com", "mamta@arrivae.com"]

# Ways in which BOQ line items can be split, for a specific category role to take care of - called Segments.
CATEGORY_SEGMENTS = ['panel', 'non_panel', 'services']

# Default split of BOQ job models with Segment.
# IMPORTANT - None for CustomJob because we use its :category_split column (from CustomElement) to find its segment.
BOQ_LI_SEGMENT_MAPPING = {
  "Boqjob"        => "non_panel",
  "ModularJob"    => "panel",
  "ServiceJob"    => "services",
  "ApplianceJob"  => "panel",
  "ExtraJob"      => "panel",
  "ShangpinJob"   => "panel"
}

# This is just the reverse of BOQ_LI_SEGMENT_MAPPING.
# We are keeping this as a separate constant because of non unique values of BOQ_LI_SEGMENT_MAPPING.
SEGMENT_BOQ_LI_MAPPING = {
  "panel" => ["ModularJob", "ApplianceJob", "ExtraJob", "ShangpinJob"],
  "non_panel" => ["Boqjob"],
  "services" => ["ServiceJob"]
}

# Mapping of BOQ line item splitting with category segments
SPLIT_SEGMENT_MAPPING = {
  "modular_kitchen"     => "panel",
  "civil_kitchen"       => "panel",
  "modular_wardrobe"    => "panel",
  "non_panel_furniture" => "non_panel",
  "panel_furniture"     => "panel",
  "services"            => "services"
}

# This is just the reverse of SPLIT_SEGMENT_MAPPING.
# We are keeping this as a separate constant because of non unique values of SPLIT_SEGMENT_MAPPING.
SPLITS_FOR_SEGMENT = {
  "panel"       => ["modular_kitchen", "civil_kitchen", "modular_wardrobe", "panel_furniture"],
  "non_panel"   => ["non_panel_furniture"],
  "services"  => ["services"]
}

SEGMENT_ROLE_MAPPING = {
  "category_panel"      => "panel",
  "category_non_panel"  => "non_panel",
  "category_services"   => "services"
}
