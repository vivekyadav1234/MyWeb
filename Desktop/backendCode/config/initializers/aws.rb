# Doing this as in aws-sdk v3, this constant is removed but is used by other older version gems eg
# papertrail.
Aws::VERSION =  Gem.loaded_specs["aws-sdk"].version
