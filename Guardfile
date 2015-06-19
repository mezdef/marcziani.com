# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# guard 'rake', :task => 'less' do
  # watch(%r{^assets/_less/.+\.less})
# end

# Add files and commands to this file, like the example:
#   watch(%r{file/path}) { `command(s)` }
#
guard :shell do
  watch /.*\.less$/ do |m|
    "Recompiling " + m[0] + " into screen.css"
    system "rake less"
    # `say -v cello #{m[0]}`
  end
end
