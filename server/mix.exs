defmodule Mayer.MixProject do
  use Mix.Project

  def project do
    [
      app: :mayer,
      version: "0.1.0",
      elixir: "~> 1.14",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Mayer.Application, []},
      extra_applications: [:logger, :runtime_tools, :ueberauth, :ueberauth_google, :scrivener]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.6.7"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.6"},
      {:myxql, ">= 0.0.0"},
      {:swoosh, "~> 1.11"},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},
      {:jason, "~> 1.2"},
      {:plug_cowboy, "~> 2.5"},
      {:guardian, "~> 2.0"},
      {:guardian_db, "~> 2.0"},
      {:argon2_elixir, "~> 3.0"},
      {:ueberauth_google, "~> 0.10"},
      {:oauth2, "~> 2.0"},
      {:ueberauth, "~> 0.6"},
      {:cors_plug, "~> 1.3"},
      {:scrivener_ecto, "~> 2.7"},
      {:faker, "~> 0.17"},
      {:poison, "~> 4.0.1"},
      {:mongodb_driver, "~> 0.9.1"},
      {:hackney, "~> 1.18"},
      {:httpoison, "~> 2.1"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end
end
