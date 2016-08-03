module Jekyll
  module MarkdownFixes
    def stripem(input)
      m = input.gsub(/<p class="md-figure"><img src="(.*?)"(.*?)\/>\s(.*?)<\/p>/, "<figure><img class='lzy' data-src='\\1' \\2/><figcaption>\\3</figcaption></figure>")
      n = m.gsub(/<p class="md-figure"><img src="(.*?)"(.*?)\/>\s<img src="(.*?)"(.*?)\/>\s(.*?)<\/p>/, "<figure class='grid'><picture><img class='lzy' data-src='\\1' \\2></picture><picture><img class='lzy' data-src='\\3' \\4></picture><figcaption>\\5</figcaption></figure>")
      return n
    end
  end
end
Liquid::Template.register_filter(Jekyll::MarkdownFixes)
