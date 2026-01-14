#!/bin/sh

echo "nameserver 8.8.8.8" | cat - /etc/resolv.conf > /tmp/resolv.conf && cat /tmp/resolv.conf > /etc/resolv.conf
echo "precedence ::ffff:0:0/96  100" > /etc/gai.conf

if [ -n "${VPN}" ]; then
  echo "Connecting to VPN."
  openvpn --config "${VPN}/config.ovpn" --daemon
  sleep 3

  if [ $(ip link | grep tun0 | wc -l) -lt 1 ]; then
    echo "Error connecting to VPN."
    exit 2
  fi
fi

echo "ip addr"
/usr/bin/ip addr

echo "/etc/hosts"
cat /etc/hosts

echo "/etc/resolv.conf"
cat /etc/resolv.conf

echo "Sleeping 10 seconds to allow services to start..."
sleep 10
# Wait for MySQL
echo "Connect to MySQL..."
until python3 -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.settimeout(1); s.connect(('172.42.0.14', 3306)); s.close()"; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done
echo "MySQL is up!"

# Wait for RabbitMQ
echo "Connect to RabbitMQ..."
until python3 -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.settimeout(1); s.connect(('172.42.0.13', 5672)); s.close()"; do
  echo "RabbitMQ is unavailable - sleeping"
  sleep 2
done
echo "RabbitMQ is up!"

su - lisa -c "export LC_ALL=C.UTF-8; export LANG=C.UTF-8; celery -A lisa.web_api.tasks worker --loglevel=info --concurrency=1 -n lisa-worker@%h"
