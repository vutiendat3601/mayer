defmodule Mayer.Schemas.Api do
  use Ecto.Schema
  import Ecto.Changeset

  alias Mayer.Schemas.{
    Schema,
    Project,
    User,
    Param,
    Dataset
  }

  schema "apis" do
    belongs_to(:schema, Schema)
    belongs_to(:project, Project)
    belongs_to(:user, User)
    belongs_to(:dataset, Dataset)
    field(:method, :integer)
    field(:name, :string)
    field(:path, :string)
    field(:api_key, :string)
    has_many(:params, Param)

    timestamps()
  end

  @doc false
  def changeset(api, attrs) do
    api
    |> cast(attrs, [
      :name,
      :method,
      :path,
      :user_id,
      :schema_id,
      :project_id,
      :dataset_id,
      :api_key
    ])
    |> validate_required([:name, :method, :path, :user_id])
  end
end
