# Be sure to restart your server when you modify this file.

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf
Mime::Type.register "application/xlsx", :xlsx

Mime::Type.register "application/xls", :xls

Mime::Type.register "application/pdf", :pdf

Mime::Type.register "image/vnd.dwg", :dwg

Rack::Mime::MIME_TYPES.merge!({
    ".xls"  => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  
    ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt"  => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".doc"  => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
})
