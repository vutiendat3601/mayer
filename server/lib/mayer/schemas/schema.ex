defmodule Mayer.Schemas.Schema do
  use Ecto.Schema
  import Ecto.Changeset

  alias Mayer.Schemas.{
    Field,
    User,
    Project,
    Api,
    Dataset
  }

  schema "schemas" do
    belongs_to(:user, User)
    belongs_to(:project, Project)
    field(:name, :string)
    has_many(:dataset, Dataset, on_delete: :delete_all)
    has_many(:api, Api, on_delete: :delete_all)
    has_many(:field, Field, on_delete: :delete_all)

    timestamps()
  end

  @doc false
  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [:name, :user_id, :project_id])
    |> validate_required([:name, :user_id])
  end
end
