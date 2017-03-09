require 'nokogiri'
module Jekyll

  module MarkdownConstruction

    def headline(input)
      doc = Nokogiri::HTML.fragment(input)
      doc.css("h2").each_with_index do |headline, index|
        headline.replace(Nokogiri.make("<h2><span>#{headline.inner_text}</span></h2>"))
      end
      doc.to_html
    end

    def figure(input)
      lzyUri = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
      picture = "<picture class='pre'><img class='lzy' src='' data-src='' /></picture>"
      doc = Nokogiri::HTML.fragment(input)
      doc.css(".md-figure").each_with_index do |figure, index|
        if figure.inner_text.length > 0
          sText = figure.inner_text
          oImgs = figure.css('img')
          figure.content = ""
          figure.add_child(oImgs)
          figure.add_child('<figcaption>' + sText + '</figcaption>')
        end
        figure.name = "figure"
        sClasses = figure["class"]
        figure["class"] = ""
        if sClasses.include? "wide"
          figure["class"] += " wide"
        end
        if sClasses.include? "screenshot"
          figure["class"] += " screenshot"
        end
        firstUrl = "default"
        figure.css("img").each_with_index do |img, index|
          if index == 0
            firstUrl = img["src"]
          end
          img["data-src"] = img["src"]
          img["src"] = lzyUri
          img["class"] = "lzy"
          img.replace(Nokogiri.make("<picture>#{img.to_html}</picture>"))
        end
      end
      doc.to_html
    end

    def gallery(input)
      lzyUri = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
      picture = "<picture class='pre'><img class='lzy' src='' data-src='' /></picture>"
      doc = Nokogiri::HTML.fragment(input)
      doc.css(".md-gallery").each_with_index do |gallery, index|
        gallery.name = "figure"
        sClasses = gallery["class"]
        gallery["class"] = "gallery"
        if sClasses.include? "wide"
          gallery["class"] += " wide"
        end
        if sClasses.include? "screenshot"
          gallery["class"] += " screenshot"
        end
        gallery.children.first.add_previous_sibling("<ul class='grid'></ul>")
        gallery.children.first.add_child(gallery.css('img'))
        gallery.children.first.add_previous_sibling(picture)
        firstUrl = "default"
        gallery.css("ul img").each_with_index do |img, index|
          if index == 0
            firstUrl = img["src"]
            img.before("<li class='active'>")
          else
            img.before("<li>")
          end
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

    def details(input)
      doc = Nokogiri::HTML.fragment(input)
      doc.css(".md-details").each_with_index do |rHtml, index|
        rHtml["class"] = "details"
        # heading = credits.previous_element
        # credits.children.first.add_previous_sibling(heading)
        rHtml.css("li strong").each_with_index do |strong, index|
          strong.name = "label"
        end
      end
      doc.css(".details").wrap("<details>")
      doc.css("details").each_with_index do |rHtml, index|
        rHtml.children.first.add_previous_sibling("<summary>details yo</summary>")
        # rHtml.add_previous_sibling ""
        rHtml["open"] = ""

      end
      doc.to_html
    end
  end

end

Liquid::Template.register_filter(Jekyll::MarkdownConstruction)
