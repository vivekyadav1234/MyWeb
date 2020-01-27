# == Schema Information
#
# Table name: price_configurators
#
#  id                 :integer          not null, primary key
#  total_price_cents  :integer          default(0)
#  pricable_type      :string
#  pricable_id        :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  food_type          :string
#  food               :string
#  family_size        :integer
#  utensil_used       :string
#  vegetable_cleaning :string
#  storage_utensils   :string
#  kind_of_food       :string
#  size_of_utensils   :string
#  habit              :string
#  platform           :string
#  hob                :string
#  chimney            :string
#  chimney_type       :string
#  sink               :string
#  dustbin            :string
#  bowl_type          :string
#  drain_board        :integer
#  light              :string
#  food_option        :string
#  cleaning_frequency :integer          default(0)
#  preparation_area   :string
#  kitchen_type       :string
#  finish_type        :string
#

class PriceConfigurator < ApplicationRecord
  #associations
  belongs_to :pricable, polymorphic: true
  has_one :price_configured, :class_name => self, :foreign_key => :id
  has_one :user, :through => :price_configured, :source => :pricable, :source_type => User
  has_one :lead, :through => :price_configured, :source => :pricable, :source_type => Lead
  attr_accessor :platform_check, :hob_check, :chimney_check

  def user_onboard_logic
    begin
      #Platform
      if self.food_type.present? && self.food_type == 'half_prepared_food'
        self.platform = '2 ft'.to_unit
      else
        self.platform = '2.5 ft'.to_unit
      end

      #hob
      if self.food == 'non_fried' && self.food_option == 'more_roti' && self.family_size <= 4
        self.hob = '2 ft'.to_unit
        self.chimney = '2 ft'.to_unit
        self.chimney_type = 'baffled'
      else
        self.hob = '2.5 ft'.to_unit
        self.chimney = '3 ft'.to_unit
        self.chimney_type = 'mezze'
      end

      #sink
      if self.utensil_used == 'less' && self.family_size <= 4 && self.vegetable_cleaning == 'less' && self.cleaning_frequency > 1 && self.storage_utensils == 'less' && self.platform == '2 ft'
        self.sink = '2 ft'.to_unit
      else
        self.sink = '3 ft'.to_unit
      end

      #dustbin
      if self.kind_of_food == 'veg'
        self.dustbin = '10 lt'
      else
        self.dustbin = '15 lt'
      end

      #bowl_type
      if self.sink == '2 ft'
        self.bowl_type = "single_2_ft_bowl"
      else
        self.bowl_type = "double_bowl"
      end

      #drain_board
      if self.size_of_utensils == 'less' && self.cleaning_frequency > 1
        self.drain_board = 0
      else
        self.drain_board = 1
      end

      #light
      if self.habit == 'enjoy_cooking'
        self.light = 'shell_mounted'
      else
        self.light = 'wall_mounted'
      end

      #preparation_area
      if self.family_size <= 4 && self.kind_of_food == "veg" && self.drain_board == 0
        self.preparation_area = '3 ft'.to_unit
      else
        self.preparation_area = '4 ft'.to_unit
      end
      save!
    rescue => error
      raise error
    end
  end

end
