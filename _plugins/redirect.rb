# frozen_string_literal: true

module Redirect
  class Generator < Jekyll::Generator
    def generate(site)
      locations = site.data["locations"]
      locations.each do |location|
        site.pages << RedirectPage.new(site, location)
      end
    end
  end
  
  class RedirectPage < Jekyll::Page
    def initialize(site, location)
      @site = site
      @base = site.source
      @dir = "/#{location["guid"]}"

      @basename = "index"
      @ext = ".html"
      @name = "index.html"

      @data = {
        "title" => "Redirecting..."
        "redirect_to" => "/?lat=#{location["lat"]}&lng=#{location["lng"]}"
      }
    end

    def url_placeholders
      {
        :path => @dir,
        :category => @dir,
        :basename => basename,
        :output_ext => output_ext
      }
    end
  end
end
