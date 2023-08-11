defmodule Mayer.AccountFromAuth do
  alias Ueberauth.Auth

  alias Mayer.Error

  def find_or_create(%Auth{provider: :identity} = auth) do
    validate_pass(auth.credentials)

    {:ok, basic_info(auth)}
  end

  def find_or_create(%Auth{} = auth) do
    {:ok, basic_info(auth)}
  end

  def find_or_create(_) do
    raise Error, code: Error.c_FALSE_LOGIN_WITH_GOOGLE()
  end

  defp validate_pass(%{other: %{password: pw, password_confirmation: pw}}), do: :ok

  defp basic_info(auth) do
    %{
      id: auth.uid,
      name: name_from_auth(auth),
      avatar: avatar_from_auth(auth),
      email: email_from_auth(auth)
    }
  end

  defp email_from_auth(%{info: %{email: email}}), do: email

  defp email_from_auth(_auth), do: nil

  # github does it this way
  defp avatar_from_auth(%{info: %{urls: %{avatar_url: image}}}), do: image

  # facebook does it this way
  defp avatar_from_auth(%{info: %{image: image}}), do: image

  # default case if nothing matches
  defp avatar_from_auth(_auth), do: nil

  # google auth
  def get_access_token(client_id, client_secret, code, redirect_uri, url) do
    headers = [
      {"Content-Type", "application/x-www-form-urlencoded"},
      {"Accept", "application/json"}
    ]

    body =
      "code=#{code}&" <>
        "client_id=#{client_id}&" <>
        "client_secret=#{client_secret}&" <>
        "redirect_uri=#{redirect_uri}&" <>
        "grant_type=authorization_code"

    case HTTPoison.post(url, body, headers) do
      {:ok, %{body: body}} ->
        access_token = Jason.decode!(body)["access_token"]
        {:ok, access_token}

      {:error, reason} ->
        {:error, reason}
    end
  end

  def get_user_email(access_token, url, provider) do
    headers = [
      {:Authorization, "Bearer #{access_token}"}
    ]

    case provider do
      "google" ->
        case HTTPoison.get(url, headers) do
          {:ok, %{body: body}} ->
            body
            |> Jason.decode!()
            |> Map.get("emailAddresses")
            |> Enum.at(0)
            |> Map.get("value")

          {:error, reason} ->
            raise "Failed to fetch user email: #{reason}"
        end

      "github" ->
        case HTTPoison.get(url, headers) do
          {:ok, %{body: body}} ->
            body
            |> Jason.decode!()
            |> Enum.at(0)
            |> Map.get("email")

          {:error, reason} ->
            raise "Failed to fetch user email: #{reason}"
        end

      _ ->
        raise Error, Error.c_NO_RESULT_FOUND()
    end
  end

  defp name_from_auth(auth) do
    if auth.info.name do
      auth.info.name
    else
      name =
        [auth.info.first_name, auth.info.last_name]
        |> Enum.filter(&(&1 != nil and &1 != ""))

      cond do
        length(name) == 0 -> auth.info.nickname
        true -> Enum.join(name, " ")
      end
    end
  end
end
