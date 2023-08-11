defmodule Mayer.Repo do
  use Ecto.Repo,
    otp_app: :mayer,
    adapter: Ecto.Adapters.MyXQL

  use Scrivener,
    page: 1,
    page_size: 6
end
