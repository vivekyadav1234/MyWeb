class CreateScopeQnas < ActiveRecord::Migration[5.0]
  def change
    create_table :scope_qnas do |t|
      t.references :scope_space, foreign_key: true
      t.text :question
      t.text :arrivae_scope
      t.text :client_scope
      t.text :remark

      t.timestamps
    end
  end
end
