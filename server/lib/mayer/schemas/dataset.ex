defmodule Mayer.Schemas.Dataset do
  use Ecto.Schema
  import Ecto.Changeset

  alias Mayer.Schemas.{
    Schema,
    Project,
    User,
    Api
  }

  schema "datasets" do
    belongs_to(:schema, Schema)
    belongs_to(:project, Project)
    belongs_to(:user, User)
    field(:collection_name, :string)
    field(:name, :string)
    has_many(:api, Api, on_delete: :nilify_all)

    timestamps()
  end

  @doc false
  def changeset(dataset, attrs) do
    dataset
    |> cast(attrs, [:name, :collection_name, :user_id, :project_id, :schema_id])
    |> validate_required([:name, :collection_name, :user_id])
  end
end
