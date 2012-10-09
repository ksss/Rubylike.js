#! /usr/bin/env rake

require "net/http"
require "rake"
require "rake/clean"

COPYRIGHT = <<EOS
// Rubylike.js (https://github.com/ksss/Rubylike.js)
// Copyright (c) 2012 ksss <co000ri@gmail.com>
EOS

CLEAN.include ["rubylike.nodoc.js"]

def mini(source)
  uri = URI.parse('http://closure-compiler.appspot.com/compile')
  req = Net::HTTP::Post.new(uri.request_uri)
  req.set_form_data({
    'js_code'           => source,
    'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
    'output_format'     => 'text',
    'output_info'       => ['compiled_code', 'errors'],
  })
  source = Net::HTTP.start(uri.host, uri.port) do |http|
    http.request(req).body
  end
  COPYRIGHT + source
end

task :default => "rubylike.nodoc.js"

file "rubylike.nodoc.js" => ["rubylike.js"] do |t|
  File.open(t.name, "w") { |f|
    f << mini(File.read("rubylike.js"))
  }
end
