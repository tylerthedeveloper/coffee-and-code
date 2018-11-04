# Set the base image to Ubuntu
FROM        ubuntu

# File Author / Maintainer
MAINTAINER Abhishek Kanike

# Update the repository and install Redis Server
RUN         apt-get update && apt-get install -y redis-server

# Install nano
RUN         apt-get install nano

# Copy Redis Conf
# COPY redis.conf /etc/redis/

# Expose Redis port 6379
EXPOSE      6379

# Run Redis Server
CMD [ "/usr/bin/redis-server", "--protected-mode no" ]
# ENTRYPOINT  ["/usr/bin/redis-server --protected-mode no"]