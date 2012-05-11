module Jekyll
  class CurrentYearTag < Liquid::Tag
    def initialize(tag_name, text, token)
      super
      @today = Time.now
    end

    def render(context)
      @today.strftime('%Y')
    end
  end

end

Liquid::Template.register_tag('current_year', Jekyll::CurrentYearTag)