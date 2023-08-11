defmodule Mayer.Auth.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :guardian,
    error_handler: Mayer.AuthErrorHandler,
    module: Mayer.Auth.Guardian

  # if there is an authorization header, restrict it to an access token and validate it
  plug Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"}
  # Load the user if either of the verifications worked
  plug Guardian.Plug.LoadResource, allow_blank: true
end
