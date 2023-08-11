FROM elixir:1.14

# Define build arguments
ARG UID
ARG GID

# Define environment variables
ENV UID=${UID:-1000}
ENV GID=${GID:-1000}

# Delete MacOS staff group's gid
RUN delgroup dialout

# Add group and user based on build arguments
RUN addgroup --gid ${GID} --system docker-user
RUN adduser --disabled-password --uid ${UID} --gid ${GID} docker-user

USER docker-user

WORKDIR /webapp

# Install Hex package manager
RUN mix local.hex --force
RUN mix local.rebar --force

COPY mix.* .

RUN mix deps.get
RUN mix deps.compile

CMD ["/bin/bash", "-c", "mix deps.get && mix phx.server"]
