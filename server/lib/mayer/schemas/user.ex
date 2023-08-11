defmodule Mayer.Schemas.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Argon2

  alias Mayer.{
    Schemas.Schema,
    Schemas.Project,
    Utils.Constants
  }

  schema "users" do
    field(:email, :string)
    field(:password, :string)
    has_many(:project, Project)
    has_many(:schema, Schema)

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :password])
    |> validate_required([:email, :password])
    |> validate_format(:email, Constants.c_EMAIL_FORMAT())
    |> unique_constraint(:email)
    |> put_password_hash()
  end

  defp put_password_hash(
         %Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset
       ) do
    change(changeset, password: Argon2.hash_pwd_salt(password))
  end

  defp put_password_hash(changeset), do: changeset
end
