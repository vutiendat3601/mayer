defmodule Mayer.Schemas.Project do
  use Ecto.Schema
  import Ecto.Changeset

  alias Mayer.Schemas.{
    User,
    Schema,
    Dataset,
    Api
  }

  schema "projects" do
    belongs_to(:user, User)
    field(:name, :string)
    has_many(:schema, Schema, on_delete: :nilify_all)
    has_many(:dataset, Dataset, on_delete: :nilify_all)
    has_many(:api, Api, on_delete: :nilify_all)

    timestamps()
  end

  @doc false
  def changeset(project, attrs) do
    project
    |> cast(attrs, [:name, :user_id])
    |> validate_required([:name, :user_id])
  end
end
