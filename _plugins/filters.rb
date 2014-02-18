module Jekyll
  module MarkdownFixes
    def stripem(input)
      m = input.gsub(/<p class="md-figure">(.*?)\/>\s(.*?)<\/p>/, "<figure>\\1 /><figcaption>\\2</figcaption></figure>")
      n = m.gsub(/<p class="md-figure">(.*?)\/>\s(.*?)\/>\s(.*?)<\/p>/, "<figure><img \\1><img \\2><figcaption>\\3</figcaption></figure>")
      return n
    end
  end
end
Liquid::Template.register_filter(Jekyll::MarkdownFixes)