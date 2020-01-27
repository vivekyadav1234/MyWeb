module ProjectSerializerCommonAttributes
  def user
    user = object.user
    if user
      return {
        id: user&.id,
        name: user&.name,
        contact: user&.contact,
        email: user&.email
      }
    else
      return nil
    end
  end

  def designer
    object.assigned_designer.slice(:id,:name,:email) if object.assigned_designer.present?
  end

  def community_manager
    object.assigned_designer&.cm&.slice(:id,:name,:email)
  end
end
