require 'base64'
    bug_name = "test"#params[:bug_name] || "Hi There"
    bug_details = "test"#params[:details] || "Nobody"
	screenshot_data = ""#params[:screenshot]

	#write screenshot data to file
	screenshot_filename = "123213213"
	File.open(screenshot_filename, 'wb') do|f|
  		f.write(Base64.decode64(screenshot_data))
	end


	require 'mingle-api'
	mingle = MingleAPI.new('testingbugsnap.mingle.thoughtworks.com', hmac: ['jnagel_test', 'xI/KyEVi0U1xhxQp9+DiTRTVYJdGmxMASw1YzFLqPRo='])


	mingle.create_card('your_first_project', name: bug_name, type: 'Story',  description: bug_details,
  		attachments: [[screenshot_filename, "image/png"]],
  		properties: {status: 'New', priority: 'high'})
	# => OpenStruct.new(number, url)

