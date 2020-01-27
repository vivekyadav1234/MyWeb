class CreateFbLeadgens < ActiveRecord::Migration[5.0]
  def change
    create_table :fb_leadgens do |t|
      t.bigint :leadgen_id
      t.datetime :fb_created_time
      t.bigint :form_id
      t.bigint :ad_id
      t.bigint :page_id
      t.bigint :adgroup_id
      t.string :field
      t.json :fb_payload_body

      t.references :lead, index:true, foreign_key: true

      t.timestamps
    end
  end
end
