defmodule MayerWeb.SessionController do
  use MayerWeb, :controller

  use Ueberauth.Strategy
  plug(Ueberauth)

  alias Mix.Tasks.Hex.User

  alias Mayer.{
    UserManager,
    Auth.Guardian,
    Validator,
    AccountFromAuth,
    Error,
    Utils.Constants,
    Mailer,
    Email
  }

  alias MayerWeb.{
    SessionView
  }

  @api_param_types_signup %{
    email: [
      type: :string,
      format: Constants.c_EMAIL_FORMAT(),
      required: true
    ],
    password: [
      type: :string,
      format: Constants.c_PASSWORD_FORMAT(),
      required: true
    ]
  }
  def sign_up(conn, params) do
    %{email: email, password: password} =
      Validator.parse(@api_param_types_signup, params) |> Validator.get_validated_changes!()

    case UserManager.get_user_by_email(email) do
      nil ->
        new_user = UserManager.create_user(%{email: email, password: password})

        new_user
        |> Email.welcome()
        |> Mailer.deliver()

        conn
        |> put_view(SessionView)
        |> render("registration.json", user: new_user)

      _ ->
        conn
        |> put_view(SessionView)
        |> render("exist_user.json")
    end
  end

  @api_param_types_signin %{
    email: [
      type: :string,
      format: Constants.c_EMAIL_FORMAT(),
      required: true
    ],
    password: [
      type: :string,
      required: true
    ]
  }
  def sign_in(conn, params) do
    %{email: email, password: password} =
      Validator.parse(@api_param_types_signin, params)
      |> Validator.get_validated_changes!()

    account = UserManager.authenticate_user!(email, password)

    case Guardian.encode_and_sign(account) do
      {:ok, token, _} ->
        conn
        |> put_view(SessionView)
        |> render("sign_in.json", token: token)

      {:error, _} ->
        raise Error, Error.c_NO_RESULT_FOUND()
    end
  end

  @api_inject :verify_email
  @api_param_types_verify_email %{
    token: [
      type: :string,
      required: true
    ]
  }
  def verify_email(conn, params, %{user_id: user_id}) do
    IO.inspect(user_id, label: "user_id")

    %{token: token} =
      Validator.parse(@api_param_types_verify_email, params)
      |> Validator.get_validated_changes!()

    IO.inspect(token, label: "token")
  end

  def sign_out(conn, _) do
    conn
    |> Guardian.Plug.sign_out()
    |> put_view(SessionView)
    |> render("sign_out.json")
  end

  @api_param_types_forgot_password %{
    email: [
      type: :string,
      format: Constants.c_EMAIL_FORMAT(),
      required: true
    ]
  }
  def forgot_password(conn, params) do
    %{email: email} =
      Validator.parse(@api_param_types_forgot_password, params)
      |> Validator.get_validated_changes!()

    case UserManager.get_user_by_email(email) do
      nil ->
        conn
        |> put_view(SessionView)
        |> render("not_exist_user.json")

      user ->
        UserManager.send_password_reset_instructions(conn, user)

        conn
        |> put_view(SessionView)
        |> render("forgot_password.json", user: user)
    end
  end

  @api_param_types_reset_password %{
    password: [
      type: :string,
      format: Constants.c_PASSWORD_FORMAT(),
      required: true
    ],
    token: [
      type: :string,
      required: true
    ]
  }
  def reset_password(conn, params) do
    %{token: token, password: password} =
      @api_param_types_reset_password
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    secret = Application.get_env(:mayer, MayerWeb.Endpoint)[:live_view][:signing_salt]

    case Phoenix.Token.verify(conn, secret, token) do
      {:ok, user_id} ->
        UserManager.get_user!(user_id)
        |> UserManager.update_user()
        |> IO.inspect(label: "user-update")

      {:error} ->
        raise Error, Error.c_NO_RESULT_FOUND()
    end

    conn
    |> put_view(SessionView)
    |> render("reset_password.json")
  end

  @api_inject :change_password
  @api_param_types_change_password %{
    password: [
      type: :string,
      format: Constants.c_PASSWORD_FORMAT(),
      required: true
    ],
    new_password: [
      type: :string,
      format: Constants.c_PASSWORD_FORMAT(),
      required: true
    ],
    email: [
      type: :string,
      format: Constants.c_EMAIL_FORMAT(),
      required: true
    ]
  }
  def change_password(conn, params, %{user_id: user_id}) do
    %{email: email, password: password, new_password: new_password} =
      @api_param_types_change_password
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    case UserManager.authenticate_user(email, password) do
      {:ok, user} ->
        UserManager.update_user(user, %{password: new_password})
        |> IO.inspect(label: "user-update")

      {:error, _} ->
        raise Error, Error.c_NO_RESULT_FOUND()
    end
  end

  # google login

  def request(conn, %{"provider" => provider}) do
    IO.inspect(provider, label: "provider-request")
    client_id = Application.get_env(:ueberauth, select_provider(provider))[:client_id]
    redirect_uri = Application.get_env(:ueberauth, select_provider(provider))[:redirect_uri]

    case provider do
      "github" ->
        redirect(conn,
          external:
            "https://github.com/login/oauth/authorize?scope=user:email&client_id=91299b2aac6272ef1764"
        )

      "google" ->
        redirect(conn,
          external:
            "https://accounts.google.com/o/oauth2/auth?client_id=957692526254-cq24r6i6046191nkk4kijcfej3vnk1cg.apps.googleusercontent.com&redirect_uri=http://localhost:4001/api/v1/auth/google/callback&scope=email%20profile&response_type=code&access_type=offline"
        )
    end
  end

  def select_provider(provider) do
    case provider do
      "google" ->
        Ueberauth.Strategy.Google.OAuth

      "github" ->
        Ueberauth.Strategy.Github.OAuth

      _ ->
        raise Error, Error.c_NO_RESULT_FOUND()
    end
  end

  def get_url_access_token(provider) do
    case provider do
      "google" ->
        "https://oauth2.googleapis.com/token"

      "github" ->
        "https://github.com/login/oauth/access_token"

      _ ->
        raise Error, Error.c_NO_RESULT_FOUND()
    end
  end

  def get_url_email(provider) do
    case provider do
      "google" ->
        "https://people.googleapis.com/v1/people/me?personFields=emailAddresses&key=AIzaSyCQizLla3qg9vmo768zFNxLiY3gihGHvMA"

      "github" ->
        "https://api.github.com/user/emails"

      _ ->
        raise Error, Error.c_NO_RESULT_FOUND()
    end
  end

  def callback(conn, %{"code" => code, "provider" => provider}) do
    client_id = Application.get_env(:ueberauth, select_provider(provider))[:client_id]
    redirect_uri = Application.get_env(:ueberauth, select_provider(provider))[:redirect_uri]
    client_secret = Application.get_env(:ueberauth, select_provider(provider))[:client_secret]
    url = get_url_access_token(provider)
    url_get_email = get_url_email(provider)

    case AccountFromAuth.get_access_token(client_id, client_secret, code, redirect_uri, url) do
      {:ok, access_token} ->
        email = AccountFromAuth.get_user_email(access_token, url_get_email, provider)
        account = UserManager.get_user_by_email(email)

        case account do
          nil ->
            conn
            |> put_view(SessionView)
            |> render("social_login.json", %{email: email, provider: provider})

          _ ->
            case Guardian.encode_and_sign(account) do
              {:ok, token, _} ->
                conn
                |> put_view(SessionView)
                |> render("sign_in.json", token: token)

              {:error, _} ->
                raise Error, Error.c_NO_RESULT_FOUND()
            end
        end

      _ ->
        raise Error, Error.c_NO_RESULT_FOUND()
    end
  end

  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    conn
    |> put_view(SessionView)
    |> render("authentication_false.json")
  end

  def test(conn, _) do
    connverify_email
    |> put_view(SessionView)
    |> render("test.json")
  end
end
