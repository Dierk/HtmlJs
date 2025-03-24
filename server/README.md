#how to create an https server certificate

openssl req -nodes -new -x509 -keyout server.key -out server.cert

openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
