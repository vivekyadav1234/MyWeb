# Objects of this class will be used for taxon data (segment, category, sub-category, class only.)
# Product taxon is not to be instantiated using this class.
class UrbanLadderModule::TaxonomyImport
  include UrbanLadderModule::ApiCallModule

  def initialize(taxon_hash)
    @id = taxon_hash[:id]
    @name = taxon_hash[:name]
    @pretty_name = taxon_hash[:pretty_name]
    @permalink = taxon_hash[:permalink]
    @parent_id = taxon_hash[:parent_id]
  end

  def self.import_taxonomy_data
    # prep the excel file
    package = Axlsx::Package.new
    workbook = package.workbook
    (0..6).each do |i|
      workbook.add_worksheet(name: "Level #{i}")
    end
    set_common_headers(workbook)

    response = UrbanLadderModule::ApiCallModule.api_call(UrbanLadderModule::ApiCallModule.taxonomy_list_url)
    h = JSON.parse(response.body).with_indifferent_access
    taxon_array = h[:taxons]
    taxon_array.each do |taxon_hash|
      import_taxon(taxon_hash, workbook)
    end

    file_name = "UrbanLadderTaxonomies-#{Time.zone.now.strftime("%Y-%m-%d")}.xlsx"
    filepath = Rails.root.join("app", "data", "urban_ladder", file_name)
    package.serialize(filepath)
  end

  # will be used recursively, until the taxons array is empty or hierarchy level 5 is reached.
  def self.import_taxon(taxon_hash, workbook, hierarchy_level = 0)
    taxon_hash = taxon_hash.with_indifferent_access
    taxon = UrbanLadderModule::TaxonomyImport.new(taxon_hash)
    sheet = workbook.sheet_by_name("Level #{hierarchy_level}")
    begin
      taxon.add_row(sheet)
    rescue
      byebug
    end

    if taxon_hash[:taxons].present? && hierarchy_level <= 7
      hierarchy_level += 1
      taxon_hash[:taxons].each do |t_hash|
        import_taxon(t_hash, workbook, hierarchy_level)
      end
    else
      return
    end
  end

  def self.set_common_headers(workbook)
    (0..6).each do |hierarchy_level|
      sheet = workbook.sheet_by_name("Level #{hierarchy_level}")
      sheet.add_row [
        'id', 
        'name', 
        'pretty_name', 
        'permalink', 
        'parent_id'
      ]
    end
  end

  def add_row(sheet)
    sheet.add_row([
      @id, 
      @name, 
      @pretty_name, 
      @permalink, 
      @parent_id
    ])
  end

  # This method will return the taxon_ids for which the products are to be imported.
  # -12 is there only for sanity check - in the email, it should be in the failure part.
  def self.taxons_for_import
    [
      305,
      306,
      309,
      317,
      319,
      324,
      325,
      326,
      328,
      329,
      332,
      333,
      334,
      363,
      365,
      366,
      367,
      369,
      374,
      375,
      376,
      377,
      378,
      379,
      397,
      413,
      422,
      423,
      426,
      429,
      431,
      440,
      441,
      458,
      464,
      465,
      562,
      573,
      605,
      547,
      651,
      695,
      759,
      760,
      833,
      1032,
      1066,
      1198,
      1238,
      1239,
      1254,
      1274,
      1279,
      1314,
      1324,
      1368,
      1378,
      1379,
      1390,
      1402,
      1403,
      1416,
      1420,
      1424,
      1432,
      1458,
      1509,
      1514,
      1515,
      1527,
      1546,
      1547,
      1559,
      1598,
      1600,
      1616,
      1677,
      1697,
      1698,
      1699,
      1702,
      1729,
      1730,
      1781,
      1782,
      2236,
      2237,
      2239,
      2401,
      2433,
      2519,
      3011,
      3191,
      3192,
      3201,
      3251,
      3252,
      3253,
      3438,
      3441,
      3442,
      3443,
      3504,
      3583,
      3584,
      3585,
      3586,
      3587,
      3588,
      3589,
      3590,
      3591,
      3592,
      7768,
      -12
    ]
  end
end
