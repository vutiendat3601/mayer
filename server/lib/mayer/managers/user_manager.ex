defmodule Mayer.UserManager do
  import Ecto.Query, warn: false

  alias Mayer.{
    Repo,
    Schemas.User,
    Error,
    Mailer,
    Email
  }

  alias Argon2

  def list_users do
    Repo.all(User)
  end

  def get_user!(id), do: Repo.get!(User, id)

  def get_user_by_email(email) do
    User
    |> where([u], u.email == ^email)
    |> Repo.one()
  end

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert!()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def update_user_password(user_id, password) do
    case get_user!(user_id) do
      user ->
        user
        |> User.changeset(%{password: password})
        |> Repo.update()

        :ok
    end
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  @from_email "support.example@app.com"
  def send_password_reset_instructions(conn, %User{} = user, attrs \\ %{}) do
    secret = Application.get_env(:mayer, MayerWeb.Endpoint)[:live_view][:signing_salt]
    token = Phoenix.Token.sign(conn, secret, user.id)
    IO.inspect(token, label: "token-sign")

    email_body = """
    <html>
    <body>
      Hi #{user.email},

      You have requested to reset your password. Please click the following link to reset your password:

      <a>http://localhost:4001/api/v1/reset_password/#{token}</a>

      If you did not request this, please ignore this email.

      Best regards,
      YourApp Team
    </body>
    </html>
    """

    email_params = %{
      from: @from_email,
      to: user.email,
      subject: "Password reset instructions",
      html_body: email_body
    }

    email_params
    |> Email.reset_password()
    |> Mailer.deliver()
  end

  def authenticate_user!(email, plain_text_password) do
    query = from(u in User, where: u.email == ^email)

    case Repo.one(query) do
      nil ->
        Argon2.no_user_verify()
        raise Error, code: Error.c_INVALID_CREDENTIALS()

      user ->
        unless Argon2.verify_pass(plain_text_password, user.password) do
          raise Error, code: Error.c_INVALID_CREDENTIALS()
        end

        user
    end
  end
end
