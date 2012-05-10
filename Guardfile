ignore_paths '_site', 'public'

guard 'coffeescript', :input => 'coffee', :output => 'javascripts'

guard 'compass' do
  watch(%r{^sass\/(.*)\.scss})
end

guard 'jekyll' do
  watch('_config.yml')
  watch(%r{^(index|about|archives|work|404)\.html})
  watch(%r{^(atom|sitemap)\.xml})
  watch(%r{^_includes\/(.*)})
  watch(%r{^_layouts\/(.*)})
  watch(%r{^(javascripts|fonts|stylesheets)\/.*})
end

guard 'puma', :port => 4000 do
  watch('Gemfile.lock')
  watch('config.ru')
end