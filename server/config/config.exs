# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :mayer,
  ecto_repos: [Mayer.Repo]

# Configures the endpoint
config :mayer, MayerWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: MayerWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: Mayer.PubSub,
  live_view: [signing_salt: "aKB3ipkQ"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :mayer, Mayer.Mailer, adapter: Swoosh.Adapters.Local

config :swoosh, :api_client, Mayer.ApiClient
# Swoosh API client is needed for adapters other than SMTP.
# config :swoosh, :api_client, Mayer.ApiClient
config :swoosh, :api_client, true

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :guardian, Mayer.Auth.Guardian,
  issuer: "mayer",
  secret_key: "NXzIxBpNrXYnpF6SjNZaHhNyFHyphsc/clbzrVKddehcnFedlfWcuJOml65zqdR5"

config :guardian, Guardian.DB, repo: Mayer.Repo

# Use Uuberauth for loggin by Google
config :ueberauth, Ueberauth,
  providers: [
    google: {Ueberauth.Strategy.Google, [default_scope: "email profile"]},
    github: {Ueberauth.Strategy.Github, [default_scope: "user:email"]}
  ]

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: "957692526254-cq24r6i6046191nkk4kijcfej3vnk1cg.apps.googleusercontent.com",
  client_secret: "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",
  redirect_uri: "http://localhost:4001/api/v1/auth/google/callback"

# Use Ueberauth for login by github
config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: "91299b2aac6272ef1764",
  client_secret: "78ca769b939416b62b9a162076313be403259ded",
  redirect_uri: "http://localhost:4001/api/v1/auth/github/callback"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
