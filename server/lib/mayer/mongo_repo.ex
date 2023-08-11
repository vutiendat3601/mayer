defmodule Mayer.MongoRepo do
  use Mongo.Repo,
    otp_app: :mayer,
    topology: :mongo
end
