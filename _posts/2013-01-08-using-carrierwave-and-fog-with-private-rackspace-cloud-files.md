---
layout: post
title: Using CarrierWave and Fog With Private Rackspace Cloud Files
published: true
---

During a recent project, I used [Rackspace Cloud Files](http://www.rackspace.com/cloud/files/) (an S3 equivalent run by Rackspace) to store mp3 files. Since the files I was working with were attached to ActiveRecord models, I immediately turned to [CarrierWave](https://github.com/jnicklas/carrierwave).  CarrierWave makes this really easy, simply configure appropriately:

```
CarrierWave.configure do |config|
  config.fog_credentials = {
    :provider               => 'Rackspace',
    :rackspace_username     => ENV['RACKSPACE_USERNAME'],
    :rackspace_api_key      => ENV['RACKSPACE_API_KEY'],
    :rackspace_servicenet   => Rails.env.production?,
    :rackspace_temp_url_key => ENV['RACKSPACE_URL_KEY']
  }
  config.fog_directory = 'mp3s'
  config.fog_public = false
end
```

Add an Uploader class to your model and you are nearly all the way there:

```
class RecordingUploader < CarrierWave::Uploader::Base
  storage :fog
end

class Recording < ActiveRecord::Base
  mount_uploader :file, RecordingUploader
end
```

But, I hit a snag. Not wanting the files I was uploading to be publicly available, I had configured `fog_public = false` in the CarrierWave configuration. But when I tried accessing the files from my AR model, I kept getting errors.  At time of writing, the latest version of CarrierWave (0.7.1) did not support private Cloud Files. Fortunately for me, CarrierWave master did.  Assuming that was all I needed, I was hopeful that my problem was fully solved but I was still having issues.

What I had missed was the `rackspace_temp_url_key`.  This is something you need to established before use.  I couldn't find a way to do this on Rackspace's website, but fortunately, [Fog](https://github.com/fog/fog) exposes an easy way to set this via API. I stuck a little bin script in my `scripts` directory and ran it to set a key:

```
#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'
require 'fog'

storage = Fog::Storage.new(:rackspace_username => ENV['RACKSPACE_USERNAME'],
                           :rackspace_api_key  => ENV['RACKSPACE_API_KEY'],
                           :provider           => 'Rackspace')
storage.post_set_meta_temp_url_key(ENV['URL_KEY'])
```

Once the `rackspace_temp_url_key` was properly setup, I was all set. Private Cloud Files accessible using CarrierWave.
