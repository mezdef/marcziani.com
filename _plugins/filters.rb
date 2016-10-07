require 'nokogiri'

module Jekyll
  module MarkdownFixes
    def stripem(input)
      m = input.gsub(/<p class="md-figure"><img src="(.*?)"(.*?)\/>\s(.*?)<\/p>/, "<figure><img class='lzy' data-src='\\1' \\2/><figcaption>\\3</figcaption></figure>")
      n = m.gsub(/<p class="md-figure"><img src="(.*?)"(.*?)\/>\s<img src="(.*?)"(.*?)\/>\s(.*?)<\/p>/, "<figure class='grid'><picture><img class='lzy' data-src='\\1' \\2></picture><picture><img class='lzy' data-src='\\3' \\4></picture><figcaption>\\5</figcaption></figure>")
      return n
    end
  end

  module GalleryConstruction
    def gallery(input)
      lzyUri = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
      picture = "<picture class='pre'><img class='lzy' src='' data-src='' /></picture>"
      doc = Nokogiri::HTML.fragment(input)
      doc.css(".md-gallery").each_with_index do |gallery, index|
        gallery.name = "figure"
        gallery["class"] = "gallery"
        gallery.children.first.add_previous_sibling("<ul class='grid'></ul>")
        gallery.children.first.add_child(gallery.css('img'))
        gallery.children.first.add_previous_sibling(picture)
        firstUrl = "default"
        gallery.css("ul img").each_with_index do |img, index|
          if index == 0
            firstUrl = img["src"]
          end
          img.before("<li>")
          img.after("</li>")
          img["data-src"] = img["src"]
          img["src"] = lzyUri
          img["class"] = "lzy"
        end
        gallery.children.first.children.first["src"] = lzyUri
        gallery.children.first.children.first["data-src"] = firstUrl
      end

      doc.to_html
    end
  end
end
Liquid::Template.register_filter(Jekyll::MarkdownFixes)
Liquid::Template.register_filter(Jekyll::GalleryConstruction)
