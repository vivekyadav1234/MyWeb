class ShangpinLayoutDetailsSerializer < ActiveModel::Serializer
  attributes :id, :name, :remark, :created_at, :updated_at
  attribute :created_by
  attribute :shangpin_jobs_cabinet
  attribute :shangpin_jobs_door
  attribute :shangpin_jobs_accessory
  attribute :shangpin_jobs_sliding_door
  attribute :shangpin_jobs_wardrobe

  def shangpin_jobs_cabinet
    object.shangpin_jobs.cabinet_jobs.map do |shangpin_job|
      ShangpinJobSerializer.new(shangpin_job).serializable_hash
    end
  end

  def shangpin_jobs_door
    object.shangpin_jobs.door_jobs.map do |shangpin_job|
      ShangpinJobSerializer.new(shangpin_job).serializable_hash
    end
  end

  def shangpin_jobs_accessory
    object.shangpin_jobs.accessory_jobs.map do |shangpin_job|
      ShangpinJobSerializer.new(shangpin_job).serializable_hash
    end
  end

  def shangpin_jobs_sliding_door
    object.shangpin_jobs.sliding_door_jobs.map do |shangpin_job|
      ShangpinJobSerializer.new(shangpin_job).serializable_hash
    end
  end

  def shangpin_jobs_wardrobe
    object.shangpin_jobs.wardrobe_jobs.map do |shangpin_job|
      ShangpinJobSerializer.new(shangpin_job).serializable_hash
    end
  end

  def created_by
    {
      email: object.created_by&.email,
      name: object.created_by&.name
    }
  end
end
