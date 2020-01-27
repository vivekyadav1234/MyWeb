class ChangeNullLabelNameInBoqLabels < ActiveRecord::Migration[5.0]
  def change
    change_column_null :boq_labels, :label_name, true
  end
end
