module Jekyll
  module MarkdownFixes
    def stripem(input)
      m = input.gsub(/<p><img(.*?)>\s<figcaption(.*?)<\/figcaption><\/p>/, "<figure><img \\1><figcaption \\2 </figcaption></figure>")
      n = m.gsub(/<p><img(.*?)>\s<img(.*?)>\s<figcaption(.*?)<\/figcaption><\/p>/, "<figure><img \\1><img \\2><figcaption \\3 </figcaption></figure>")
      return n
    end
  end
end
Liquid::Template.register_filter(Jekyll::MarkdownFixes)