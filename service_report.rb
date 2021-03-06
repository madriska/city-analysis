require "csv"
require "active_support"
require 'active_support/core_ext'
require "pp"
require "json"


codes = JSON.parse(File.read("services.json")).map { |x| x["service_code"] }

codes.product((1..30).to_a).each do |code, ward|
  summary = Hash.new { |h,k| h[k] = { :opened => 0, :closed => 0 } }

  CSV.foreach("scf-data.csv", :headers => true) do |e| 
    next unless e["request_type_id"] == code.to_s && e["ward"] == ward.to_s

    if e["created_at"].present?
      summary[Date.parse(e["created_at"]).monday][:opened] += 1 
    end

    if e["closed_at"].present?
      summary[Date.parse(e["closed_at"]).monday][:closed] += 1 
    end
  end

  week   = Date.parse("2010-01-01").monday
  finish = Date.parse("2016-06-01").monday

  csv = File.open("public/data/#{code}-#{ward}.csv", "w")
  
  csv.puts "week,opened,closed"

  while week < finish
    summary[week][:opened] += summary[week - 7][:opened]
    summary[week][:closed] += summary[week - 7][:closed]

    csv.puts [week, summary[week][:opened], summary[week][:closed]].to_csv
    week += 7
  end

  csv.close
end
