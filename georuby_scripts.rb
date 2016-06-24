require "geo_ruby"
require 'geo_ruby/geojson'
require "csv"


=begin
# CSV WITH ADDED WARD COLUMN

def ward(point)
  location = @obj.features.find do |e| 
    e.geometry.geometries.any? { |x| x.contains_point?(point) }
  end
  location.nil? ? "" : location.properties["wards"]
end

def point(x, y)
  GeoRuby::SimpleFeatures::Point.from_xy(x.to_f, y.to_f)
end

@obj =  GeoRuby::SimpleFeatures::Geometry.from_geojson(
  File.read("newhaven.geojson")
)

puts "status,request_type_id,id_,summary,description,created_at,acknowledged_at,closed_at,lat,lng,address,city_id,ward"

CSV.foreach("nhv-scf.csv") do |row|
  point = point(row[9], row[8])
  puts (row << ward(point)).to_csv
end



# INSTANCES OF EACH WARD

wards = Hash.new { |h,k| h[k] = 0 }

CSV.foreach("wards.csv", headers: true) do |row|
  ward = row["ward"]
  wards[ward] += 1
end

p wards.sort_by { |k,v| v }.to_h



# CSV OF ALL ISSUES RELATED TO SIDEWALKS

puts "status,request_type_id,id_,summary,description,created_at,acknowledged_at,closed_at,lat,lng,address,city_id,ward"

CSV.foreach("wards.csv", headers: true) do |row|
  puts row.to_csv if row["request_type_id"] == "117"
end

=end


# CSV OF ISSUE COUNTS BY WARD

puts "ward,open,closed"

wards = Hash.new { |h,k| h[k] = { opened: 0, closed: 0 } }

CSV.foreach("wards.csv", headers: true) do |row|
  next unless row["request_type_id"] == "117"

  ward = row["ward"]
  wards[ward][:opened] += 1 unless row["created_at"].nil?
  wards[ward][:closed] += 1 unless row["closed_at"].nil?
end

wards.each { |k,v| puts [k, v[:opened], v[:closed]].join(",") }
