module Jekyll
  module MarkdownFixes
    def stripem(input)
      m = input.gsub(/<p><img(.*?)>\s<figcaption(.*?)<\/figcaption><\/p>/, "<figure><img \\1><figcaption \\2 </figcaption></figure>")
      return m
    end
  end
end
Liquid::Template.register_filter(Jekyll::MarkdownFixes)