# == Schema Information
#
# Table name: scope_of_works
#
#  id             :integer          not null, primary key
#  project_id     :integer
#  client_details :text
#  date           :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class ScopeOfWorkSerializer < ActiveModel::Serializer
  attributes :id, :project_id,:client_details, :date, :scope_spaces, :created_at, :updated_at

  def scope_spaces
  	scope_spaces = object.scope_spaces
  	arr = []
  	scope_spaces.each do |scope_space|
  	  hash = Hash.new
  	  hash["id"] = scope_space.id
  	  hash["space_type"] = scope_space.space_type
  	  hash["space_name"] = scope_space.space_name
  	  space_q_and_a = []
  	  scope_qnas = scope_space.scope_qnas
  	  scope_qnas.each do |scope_qna|
  	  	q_n_a_hash = Hash.new 
  	  	q_n_a_hash["id"] = scope_qna.id
  	  	q_n_a_hash["question"] = scope_qna.question
  	  	q_n_a_hash["arrivae_scope"] = scope_qna.arrivae_scope
  	  	q_n_a_hash["client_scope"] = scope_qna.client_scope
        q_n_a_hash["remark"] = scope_qna.remark
  	  	space_q_and_a.push(q_n_a_hash)
  	  end
  	  hash["scope_qnas"] = space_q_and_a
  	  arr.push(hash)
  	end
  	arr
  end
  
end
