  require 'mingle-api'
  module Api
    module V1
      class MingleBugsController < ApplicationController
        def index
      		
  		end
  		
  		def create 
  			bug_name = params[:bug_name] || "testing"
      		bug_details = params[:bug_description] || "Nobody"
	  		screenshot_data = params[:image_data] || ""
			
			puts "******\n***\nTrying to write to Mingle"
			
	  		#write screenshot data to file
	  		screenshot_filename ||= "#{SecureRandom.urlsafe_base64}.png"
	  		puts "***Writing to " + screenshot_filename
	  		File.open(screenshot_filename, 'wb') do|f|
  				f.write(Base64.decode64(screenshot_data))
	  		end

	  		mingle = MingleAPI.new('testingbugsnap.mingle.thoughtworks.com', hmac: ['jnagel_test', 'xI/KyEVi0U1xhxQp9+DiTRTVYJdGmxMASw1YzFLqPRo='])


	  		response = mingle.create_card('your_first_project', name: bug_name, type: 'story', description: bug_details,
  				attachments: [[screenshot_filename, "image/png"]],
  				properties: {status: 'New', priority: 'high'})
	    		# => OpenStruct.new(number, url)
	    	
	    	card_number = response.number
	    	puts "Successfully wrote to Mingle " + card_number
	    	render :json => card_number.to_json
  		end
  		
  
      end
    end
  end