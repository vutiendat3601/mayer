defmodule MayerWeb.SessionView do
  use MayerWeb, :view

  def render("registration.json", %{user: user}) do
    %{
      errors: [],
      data: render("user.json", %{user: user})
    }
  end

  def render("user.json", %{user: user}) do
    %{
      email: user.email
    }
  end

  def render("request.json", _) do
    %{
      errors: [],
      data: "Doing request!"
    }
  end

  def render("sign_in.json", %{token: token}) do
    %{
      errors: [],
      token: token
    }
  end

  def render("sign_out.json", _) do
    %{
      errors: [],
      data: []
    }
  end

  #  %{email: email}, %{provider: provider}
  def render("social_login.json", %{email: email, provider: provider}) do
    %{
      errors: [],
      email: email,
      provider: provider
    }
  end

  def render("authentication_false.json", _) do
    %{
      errors: [],
      data: "Sign in not successfully!"
    }
  end

  def render("test.json", _) do
    %{
      errors: [],
      data: "I am a message from Server!"
    }
  end

  def render("verify_email.json", _) do
    %{
      errors: [],
      data: "Verify email successfully!"
    }
  end

  def render("exist_user.json", _) do
    %{
      errors: ["Email is existed!"],
      data: []
    }
  end

  def render("not_exist_user.json", _) do
    %{
      errors: ["Email is not existed!"],
      data: []
    }
  end

  def render("forgot_password.json", %{user: user}) do
    %{
      errors: [],
      data: "Password reset instructions sent to your #{user.email}!"
    }
  end

  def render("reset_password.json", _) do
    %{
      errors: [],
      data: "Reset password successfully!"
    }
  end

  def render("error_reset_password.json", _) do
    %{
      errors: ["Reset password failed!"],
      data: []
    }
  end

  def render("token_invalid.json", _) do
    %{
      errors: ["Token invalid!"],
      data: []
    }
  end

  def render("test_github.json", _) do
    %{
      errors: [],
      data: "Github login successfully!"
    }
  end
end
