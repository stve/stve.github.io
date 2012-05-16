require 'cgi'
require 'digest/md5'
require 'net/https'
require 'uri'
require 'pygments'

module Jekyll
  class GistTag < Liquid::Tag
    def initialize(tag_name, text, token)
      super
      @text           = text
      @cache_disabled = false
      @cache_folder   = File.expand_path("../.gist-cache", File.dirname(__FILE__))
      FileUtils.mkdir_p(@cache_folder)
    end

    def render(context)
      if parts = @text.match(/([\d]*) (.*\.\w*)\ (.*)/)
        gist, file, lang  = parts[1].strip, parts[2].strip, parts[3].strip
        get_gist(gist, file, lang)
      else
        ""
      end
    end

    def get_gist_url_for(gist, file)
      "https://raw.github.com/gist/#{gist}/#{file}"
    end

    def get_gist(gist, file, lang)
      get_cached_gist(gist, file) || get_gist_from_web(gist, file, lang)
    end

    def cache(gist, file, data, lang)
      cache_file = get_cache_file_for(gist, file)
      parsed_data = Pygments.highlight(data, :lexer => lang)
      File.open(cache_file, "w") do |io|
        io.write(parsed_data)
      end
    end

    def get_cached_gist(gist, file)
      return nil if @cache_disabled
      cache_file = get_cache_file_for(gist, file)
      File.read(cache_file) if File.exist?(cache_file)
    end

    def get_cache_file_for(gist, file)
      bad_chars = /[^a-zA-Z0-9\-_.]/
      gist      = gist.gsub(bad_chars, '')
      file      = file.gsub(bad_chars, '')
      md5       = Digest::MD5.hexdigest("#{gist}-#{file}")
      File.join(@cache_folder, "#{gist}-#{file}-#{md5}.cache")
    end

    def get_gist_from_web(gist, file, lang)
      gist_url          = get_gist_url_for(gist, file)
      raw_uri           = URI.parse(gist_url)
      https             = Net::HTTP.new(raw_uri.host, raw_uri.port)
      https.use_ssl     = true
      https.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request           = Net::HTTP::Get.new(raw_uri.request_uri)
      data              = https.request(request)
      data              = data.body
      cache(gist, file, data, lang) unless @cache_disabled
      data
    end
  end
end

Liquid::Template.register_tag('gist', Jekyll::GistTag)