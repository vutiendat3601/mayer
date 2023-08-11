import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :mayer, Mayer.Repo,
  username: "root",
  password: "",
  hostname: "localhost",
  database: "mayer_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :mayer, MayerWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "EQmXe3vY/6Fc5+UWX70Fwlld35+aCPCNiwKl6EkHcywpQGqb2urv6VJWUm6uX+vG",
  server: false

# In test we don't send emails.
config :mayer, Mayer.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
