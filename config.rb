module ::Rails
  def self.version
    "3.0"
  end
end

require "compass_twitter_bootstrap"

http_path = "/"
css_dir = "stylesheets"
sass_dir = "sass"
images_dir = "images"
javascripts_dir = "javascripts"

output_style = :compressed

sass_options = {
  :syntax => :scss
}