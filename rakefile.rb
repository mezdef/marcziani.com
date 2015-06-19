# Tasks ////////////////////////////////////////////////////////////

desc "Require confirmation"
task :confirm do
  c_token = rand(36**6).to_s(36)
  STDOUT.puts "Are you sure? Enter '#{c_token}' to confirm:"
  input = STDIN.gets.chomp
  raise "Aborting. You entered #{input}" unless input == c_token
end

desc "Parse haml layouts"
task :haml do
  print "Parsing Haml layouts..."
  system(%{
    cd _pages/ &&
    for f in *.haml; do [ -e $f ] && haml $f ../${f%.haml}.html; done
  })
  puts "done."
end

desc "Parse less layouts"
task :less do
  print "Parsing Less layouts..."
  system "lessc assets/screen.less > _site/assets/screen.css"
end

desc "Clean _site"
task :clean do
  system "rm -rf _site"
end

desc 'Build for deployment'
task :build => [:confirm, :haml, :clean] do |task, args|
  system "jekyll build"
end

# Development //////////////////////////////////////////////////////

desc 'Run Jekyll'
task :jekyll => [:haml, :clean] do |task, args|
  system "jekyll serve --watch"
end

# Deployment ///////////////////////////////////////////////////////

desc "Deploy to S3"
task :sync => [:build] do
  system "s3_website push"
end
