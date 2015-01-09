require 'rspec'
require 'capybara/rspec'
require 'capybara/poltergeist'

require 'rack'

Capybara.app = Rack::Builder.new do
  map "/" do
    use Rack::Static, :urls => [""], :root => '_site'
    run lambda {|env| [404, {}, '']}
  end
end.to_app

Capybara.default_selector = :css
Capybara.javascript_driver = :poltergeist
