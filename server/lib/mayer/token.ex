defmodule Mayer.Token do
  alias Mayer.{
    Schemas.User
  }

  @moduledoc """
  Handles creating and validating tokens.
  """

  @account_verification_salt "account verification salt"

  def generate_new_account_token(%User{id: user_id}) do
    Phoenix.Token.sign(MayerWeb.Endpoint, @account_verification_salt, user_id)
  end
end
