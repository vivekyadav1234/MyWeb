require 'swagger_helper'

describe 'Questionnaire API' do

  path '/v1/note_records' do
    get 'Get Questionnaire for a Lead' do
      tags 'Questionnaire'
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :ownerable_id, :in => :query, :type => :string, required: true, 
      description: "Pass the Lead ID"
      parameter name: :ownerable_type, :in => :query, :type => :string, required: true, 
      description: "Pass the value as Lead"

      response '200', 'Questionnaire found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Questionnaire not found' do
        let(:id) { 'invalid' }
        run_test!
      end

      response '406', 'unsupported accept header' do
        let(:'Accept') { 'application/json' }
        run_test!
      end
      response '401', 'unauthorised' do
        let(:'Accept') { 'application/json' }
        run_test!
      end
      response '402', 'unauthorised' do
        let(:'Accept') { 'application/json' }
        run_test!
      end
      response '403', 'unauthorised' do
        let(:'Accept') { 'application/json' }
        run_test!
      end
      response '422', 'unsupported data' do
        let(:'Accept') { 'application/json' }
        run_test!
      end
    end

  end
end