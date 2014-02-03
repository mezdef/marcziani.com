# desc "Parse haml layouts"
# task :parse_haml do
#   print "Parsing Haml layouts..."
#   system(%{
#     cd _layouts/haml &&
#     for f in *.haml; do [ -e $f ] && haml $f ../${f%.haml}.html; done
#     cd ../../_includes/haml &&
#     for f in *.haml; do [ -e $f ] && haml $f ../${f%.haml}.html; done
#     cd ../../_pages &&
#     for f in *.haml; do [ -e $f ] && haml $f ../${f%.haml}.html; done
#   })
#   puts "done."
# end

# desc "Launch preview environment"
# task :preview do
#   Rake::Task["parse_haml"].invoke
#   system "jekyll server --watch"
# end

# desc "Build site"
# task :build do |task, args|
#   Rake::Task["parse_haml"].invoke
#   system "jekyll"
# end

namespace :haml do
  require 'haml'
 
  def convert file, destination
    base_name = File.basename(file, '.haml') + '.html'
    html = File.open(file, 'r') { |f| Haml::Engine.new(f.read).render }
    File.open(File.join(destination, base_name), 'w') { |f| f.write html }
  end
 
  desc 'Parse haml layout files'
  task :layouts do
    Dir.glob('_layouts/_haml/*.haml') do |path|
      convert path, '_layouts'
    end
 
    # puts 'Parsed haml layout files'
  end
 
  desc 'Parse haml include files'
  task :includes do
    Dir.glob('_includes/_haml/*.haml') do |path|
      convert path, '_includes'
    end
 
    # puts 'Parsed haml include files'
  end
 
  desc 'Parse haml pages files'
  task :pages do
    Dir.glob('_pages/*.haml') do |path|
      convert path, './'
    end
 
  end
 
end
 
desc 'Parse all haml items'
task haml: ['haml:layouts', 'haml:includes', 'haml:pages'] do
    puts Time.now.strftime('%H:%M:%S') + " // regenerated HAML"
end
 
desc 'Parse sass files'
task :sass do
  require 'sass'
  
  system 'compass compile assets/css/_sass/'
  # css = File.open('assets/css/_sass/main.sass', 'r') { |f| Sass::Engine.new(f.read).render }
  # File.open('assets/css/main.css', 'w') { |f| f.write css }
 
  # puts Time.now.strftime('%H:%M:%S') + " // regenerated SASS"
end

# Development //////////////////////////////////////////////////////////////////////////////////////

desc 'Run Guard'
task :guard do
  system 'bundle exec guard -i'
end

desc 'Run Jekyll'
task :jekyll do
  system 'jekyll server --watch'
end

task :compass do
  system 'compass compile assets/css/_sass/'
end
 
# Deployment ///////////////////////////////////////////////////////////////////////////////////////

desc 'Build all haml and sass files for deployment'
task build: [:haml, :sass]
