# Set the base image to Ubuntu
FROM        ubuntu

# Update the repository and install Redis Server
RUN         apt-get update && \
            # Install redis
            apt-get install -y redis-server && \
            # Install nano
            apt-get install nano

# Expose Redis port 6379
EXPOSE      6379

# COPY redis.conf /usr/local/etc/redis/redis.conf
# COPY redis.conf etc/redis/redis.conf

# Run Redis Server
# Bind all ports
# Require secret password
CMD [ "/usr/bin/redis-server", "--requirepass \"CodeWithCoffee\"" ]