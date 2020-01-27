require 'swagger_helper'

describe 'Mobile Events API' do

  path '/v1/mobile/events' do
    get 'Get all events' do
      # security [ apiKey: [] ]
      tags 'Events'
      # consumes 'application/json'
      parameter name: :from_date, :in => :query, :type => :string, required: true
      parameter name: :to_date, :in => :query, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :status, in: :query, type: :string

      # parameter name: :id, :in => :path, :type => :string

      response '200', 'Events found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end

      response '406', 'unsupported accept header' do
        let(:'Accept') { 'application/foo' }
        run_test!
      end
    end
    post 'Create new event' do
      # security [ apiKey: [] ]
      tags 'Events'
      # consumes 'application/json'
      # :agenda, :description,
      # :scheduled_at, :status, :ownerable_type, :ownerable_id,
      # :location, :contact_type, :remark
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :event, in: :body, schema: {
      type: :object,
      properties: {
        :agenda => { type: :string },
        :description => { type: :string },
        :scheduled_at => { type: :string },
        :status => { type: :string },
        :ownerable_type => { type: :string },
        :ownerable_id => { type: :integer },
        :location => { type: :string },
        :contact_type => { type: :string },
        :remark => { type: :string },
      },
      # required: [ 'title', 'content' ]
      }

      # parameter name: :id, :in => :path, :type => :string

      response '200', 'Events created' do
        let(:id) { 'done' }
        run_test!
      end
    end
  end

  path '/v1/mobile/events/history' do
    get 'History of one lead' do
      # security [ apiKey: [] ]
      tags 'Events'
      # consumes 'application/json'
      parameter name: :from_date, :in => :query, :type => :string
      parameter name: :to_date, :in => :query, :type => :string
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :status, in: :query, type: :string
      parameter name: :ownerable_id, in: :query, type: :string, required: true
      parameter name: :history_type, in: :query, type: :string, required: true

      # parameter name: :id, :in => :path, :type => :string

      response '200', 'Events found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end

      response '406', 'unsupported accept header' do
        let(:'Accept') { 'application/foo' }
        run_test!
      end
    end
  end

  path '/v1/mobile/events/last_call' do
    get 'Last call of one lead' do
      # security [ apiKey: [] ]
      tags 'Events'
      # consumes 'application/json'
      # parameter name: :from_date, :in => :query, :type => :string, required: true
      # parameter name: :to_date, :in => :query, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :ownerable_id, in: :query, type: :string, required: true

      # parameter name: :id, :in => :path, :type => :string

      response '200', 'Events found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end

      response '406', 'unsupported accept header' do
        let(:'Accept') { 'application/foo' }
        run_test!
      end
    end
  end

  path '/v1/mobile/events/last_meeting' do
    get 'Last meeting of one lead' do
      # security [ apiKey: [] ]
      tags 'Events'
      # consumes 'application/json'
      # parameter name: :from_date, :in => :query, :type => :string, required: true
      # parameter name: :to_date, :in => :query, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :ownerable_id, in: :query, type: :string, required: true

      # parameter name: :id, :in => :path, :type => :string

      response '200', 'Events found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end

      response '406', 'unsupported accept header' do
        let(:'Accept') { 'application/foo' }
        run_test!
      end
    end
  end

  path '/v1/mobile/events/{event_id}/' do

    patch 'Update Event' do
      tags 'Events'
      parameter name: :event_id, :in => :path, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :event, in: :body, schema: {
        type: :object,
        properties: {
          :agenda => { type: :string },
          :description => { type: :string },
          :scheduled_at => { type: :string },
          :status => { type: :string },
          :ownerable_type => { type: :string },
          :ownerable_id => { type: :integer },
          :location => { type: :string },
          :contact_type => { type: :string },
          :remark => { type: :string },
        },
        # required: [ 'title', 'content' ]
      }

      response '200', 'Events created' do
        let(:id) { 'done' }
        run_test!
      end

      response 422, 'invalid request' do
        header 'X-Rate-Limit-Limit', type: :integer, description: 'The number of allowed requests in the current period'
        header 'X-Rate-Limit-Remaining', type: :integer, description: 'The number of remaining requests in the current period'
        run_test!
      end
    end
  end

  # GET /api/v1/mobile/leads
  path '/v1/mobile/leads' do
    get 'Get all events' do
      # security [ apiKey: [] ]
      tags 'Leads'
      # consumes 'application/json'
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :is_in_pipeline, :in => :query, :type => :boolean

      response '200', 'Events found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:'Accept') { 'application/foo' }
        run_test!
      end

      response '406', 'unsupported accept header' do
        let(:'Accept') { 'application/foo' }
        run_test!
      end
    end
  end

  path '/v1/mobile/leads/{lead_id}/' do

    patch 'Update Lead | Move to Pipeline' do
      tags 'Leads'
      parameter name: :lead_id, :in => :path, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :lead, in: :body, schema: {
        type: :object,
        properties: {
          :is_in_pipeline => { type: :boolean }
        },
        required: [ 'is_in_pipeline' ]
      }

      response '200', 'Lead updated' do
        let(:id) { 'done' }
        run_test!
      end

      response 422, 'invalid request' do
        header 'X-Rate-Limit-Limit', type: :integer, description: 'The number of allowed requests in the current period'
        header 'X-Rate-Limit-Remaining', type: :integer, description: 'The number of remaining requests in the current period'
        run_test!
      end
    end
  end
  # GET /api/v1/mobile/leads/{lead_id}/mark_as_read
  path '/v1/mobile/leads/{lead_id}/mark_as_read' do

    get 'Update Lead | Mark as Read' do
      tags 'Leads'
      parameter name: :lead_id, :in => :path, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true

      response '200', 'Lead updated' do
        let(:id) { 'done' }
        run_test!
      end

      response 422, 'invalid request' do
        header 'X-Rate-Limit-Limit', type: :integer, description: 'The number of allowed requests in the current period'
        header 'X-Rate-Limit-Remaining', type: :integer, description: 'The number of remaining requests in the current period'
        run_test!
      end
    end
  end

  # http://localhost:3000/v1/users/9618/cm_wip_leads?page=&status=active&search=akash
  path '/v1/users/{user_id}/cm_wip_leads' do
    get 'Get all Leads ' do
      # security [ apiKey: [] ]
      tags 'Search Lead'
      # consumes 'application/json'
      parameter name: :user_id, :in => :path, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :page, :in => :query, :type => :integer
      parameter name: :status, :in => :query, :type => :string, required: true,
        description: "Options are: active"
      parameter name: :search, :in => :query, :type => :string, required: true

      response '200', 'Lead found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end

      response '406', 'unsupported accept header' do
        let(:'Accept') { 'application/foo' }
        run_test!
      end
    end
  end

  #....................Lead Generation....................

  path '/v1/leads' do
    post 'Lead Generation' do
      tags 'Leads'
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :lead, in: :body, schema: {
        type: :object,
        properties: {
          :name => { type: :string },
          :email => { type: :string, required: true },
          :contact => { type: :string },
          :created_by => { type: :string },
          :instagram_handle => { type: :string },
          :lead_campaign_id => { type: :string },
          :lead_source_id => { type: :string },
          :lead_source_type => { type: :string },
          :lead_status => { type: :string },
          :lead_type_id => { type: :string },
          :lead_type_name => { type: :string },
          :pincode => { type: :string },
          :referrer_id => { type: :string },
          :referrer_type => { type: :string },
          :user_id => { type: :string },
        }
        # required: [ 'lead_contact', 'select_lead_type',
        # 'Select_lead_source', 'Referrer_user_type' ]
      }
      response '200', 'Lead created' do
        let(:id) { 'done' }
        run_test!
      end
    end
  end

  #...........Lead Assignment...........
  path 'v1/leads/{id}/assign_lead' do
    get 'Lead Assignment' do
      tags 'Leads'
      parameter name: :id, :in => :path, :type => :string, required: true
      parameter name: :agent_id, :in => :query, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true

      response '200', 'Events found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end
  end

  #...........Lead Update...............
  path '/v1/leads/{id}' do
    patch 'Lead Update' do
      tags 'Leads'
      parameter name: :id, :in => :path, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :lead, in: :body, schema: {
        type: :object,
        properties: {
          :name => { type: :string },
          :email => { type: :string },
          :contact => { type: :string },
          :pincode => { type: :string },
          :lead_type_id => { type: :string },
          :lead_source_id => { type: :string },
          :lead_campaign_id => { type: :string },
          :referrer_type => { type: :string },
          :referrer_id => { type: :string },
          :change_status => { type: :string },
          :follow_up_time => { type: :string },
          :instagram_handle => { type: :string },
          :lead_cv => { type: :string },
          :lead_status => { type: :string },
          :lead_type_name => { type: :string },
          :lost_reason => { type: :string },
          :lost_remark => { type: :string },
          :remark => { type: :string },
        }
        # required: [ 'name', 'lead_email', 'lead_contact', 'select_lead_type', 'select_lead_source', 'Referrer_user_type', 'referrer_user' ]
      }
      response '200', 'Lead created' do
        let(:id) { 'done' }
        run_test!
      end
    end
  end




  #...........Create Event..............
  path '/v1/events' do
    post 'Create Event' do
      tags 'Events'
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :event, in: :body, schema: {
        type: :object,
        properties: {
          :agenda => { type: :string },
          :contact_type => { type: :string },
          :description => { type: :string },
          :emails => { type: :string },
          :location => { type: :string },
          :ownerable_id => { type: :string },
          :ownerable_type => { type: :string },
          :scheduled_at => { type: :string },
          :status => { type: :string },
        }
        # required: [ 'name', 'agenda', 'type', 'date', 'notify_to' ]
      }
      response '200', 'event created' do
        let(:id) { 'done' }
        run_test!
      end
    end
  end


  #.....................Read Event..................

  path '/v1/events' do
    get 'Get all events' do
      # security [ apiKey: [] ]
      tags 'Events'
      # consumes 'application/json'
      parameter name: :from_date, :in => :query, :type => :string, required: true
      parameter name: :to_date, :in => :query, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true

      # parameter name: :id, :in => :path, :type => :string

      response '200', 'Events found' do
        let(:id) { 'done' }
        run_test!
      end

      response '404', 'Event Page not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end
  end
  #.....................Update Event.................
  path 'v1/events/{id}/reschedule_event' do
    patch 'Update Event' do
      tags 'Events'
      parameter name: :id, :in => :path, :type => :string, required: true
      parameter name: 'access-token', :in => :header, :type => :string, required: true
      parameter name: :client, :in => :header, :type => :string, required: true
      parameter name: :uid, :in => :header, :type => :string, required: true
      parameter name: :event, in: :body, schema: {
        type: :object,
        properties: {
          :agenda => { type: :string },
          :contact_type => { type: :string },
          :description => { type: :string },
          :emails => { type: :string },
          :location => { type: :string },
          :ownerable_id => { type: :string },
          :ownerable_type => { type: :string },
          :remark => { type: :string },
          :scheduled_at => { type: :string },
          :status => { type: :string },
        }
        # required: [ 'name', 'agenda', 'type', 'date', 'remarks', 'notify_to' ]
      }
      response '200', 'event created' do
        let(:id) { 'done' }
        run_test!
      end
    end
  end
  # #..................Delete Event....................
  # path '/v1/events/id' do
  #   delete
  # GET project details for a lead
end
