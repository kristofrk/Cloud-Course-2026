docker run -it -p 80:80 \
  --add-host=host.docker.internal:host-gateway \
  -e WORDPRESS_DB_HOST=database-1.cik54qrkmcz2.us-east-1.rds.amazonaws.com:3306 \
  -e WORDPRESS_DB_USER=wpuser \
  -e WORDPRESS_DB_PASSWORD='AWStest2025!' \
  -e WORDPRESS_DB_NAME=wordpressdb \
  wordpress
