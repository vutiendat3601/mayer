defmodule Mayer.Email do
  import Swoosh.Email

  def welcome(user) do
    new()
    |> to({"user", user.email})
    |> from({"App", "contacts@gmail.com"})
    |> subject("Welcome!")
    |> html_body("<h1>Hello #{user.email} </h1>")
    |> text_body("Hello #{user.email}\n")
  end

  def reset_password(params) do
    IO.inspect(params, label: "params")

    new()
    |> to({"name", params.to})
    |> from({"App", params.from})
    |> subject(params.subject)
    |> html_body(params.html_body)
  end
end
