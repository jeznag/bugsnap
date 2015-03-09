post '/mingle-bug/' do
    bug_name = params[:bug_name] || "Hi There"
    bug_details = params[:details] || "Nobody"
	screenshot_data = params[:screenshot]

	//write screenshot data to file
	screenshot_filename = random_filename
	File.open(screenshot_filename, 'wb') do|f|
  		f.write(Base64.decode64(screenshot_data))
	end


	require 'mingle-api'
	mingle = MingleAPI.new('testingbugsnap.mingle.thoughtworks.com', hmac: ['jnagel_test', 'xI/KyEVi0U1xhxQp9+DiTRTVYJdGmxMASw1YzFLqPRo='])


	mingle.create_card('your_first_project', name: bug_name, type: 'Story',
  		attachments: [[screenshot_filename, "image/png"]],
  		properties: {status: 'New', priority: 'high'}), description: bug_details
	# => OpenStruct.new(number, url)

end

def random_filename
    @string ||= "#{SecureRandom.urlsafe_base64}.png"
end