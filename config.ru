require 'rack/contrib/try_static'
require 'rack/contrib/not_found'
# require 'rack/rewrite'

# use Rack::Rewrite do
# end

use Rack::TryStatic,
    :root => "_site",
    :urls => %w[/],
    :try => ['.html', 'index.html', '/index.html']

run Rack::NotFound.new '404.html'