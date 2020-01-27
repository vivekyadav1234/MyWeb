require 'swagger_helper'

describe 'Mobile Recordings API' do

  path '/v1/recordings' do
    get 'Get all Recordings' do
      tags 'Recordings'
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :event_id, :in => :query, :type => :string
      parameter name: :lead_id, :in => :query, :type => :string

      response '200', 'Recordings found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end

      response '406', 'unsupported accept header' do
        let(:'Accept') { 'application/json' }
        run_test!
      end
       response '422', 'unsupported data' do
        let(:'Accept') { 'application/json' }
        run_test!
      end
    end

    post 'Create new recording | Create Event For Follow up' do
      tags 'Recordings'
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :event_id, :in => :query, :type => :string , description: 'Event ID | In case of follow up | You can pass "new" (project_id is required in that case) to create new event.'
      parameter name: :call_recording, in: :body, description: 'Recording File',schema: {
        type: "string",
        format: "binary"
      }
      parameter name: :duration, in: :query, type: :string, description: 'Duration | If case of iPhone | You can use this field to store call duration.'
      parameter name: :note, in: :query, type: :string, description: 'Note | If case of iPhone | You can use this field to store call recording related data.'
      parameter name: :project_id, in: :query, type: :integer, description: 'Project Id | If event id is not there (i.e. in case of Follow up) you can use this field to create new event for the project.'
      
      response '200', 'Recordings created' do
        let(:id) { 'done' }
        run_test!
      end
      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end
      response '406', 'unsupported accept header' do
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