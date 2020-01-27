class ClientProjectSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id,:name

  def serializable_hash
    data = super
    data[:data]
  end
  
end
