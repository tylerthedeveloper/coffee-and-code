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

# ENV REDIS_PWD $REDIS_PWD

# CMD ["echo $REDIS_PWD > /env.txt"]
# RUN echo $REDIS_PWD > env.txt


# Run Redis Server
#  TODO: add pasword
# CMD [ "/usr/bin/redis-server" , "--requirepass \"$REDIS_PWD\"" ]
CMD [ "/usr/bin/redis-server" , "--protected-mode no" ]