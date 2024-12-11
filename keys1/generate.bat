openssl genrsa -out keypair.pem 4096
openssl rsa -in keypair.pem -pubout -out publickey.crt
openssl rsa -in keypair.pem -pubout > publickey.pub