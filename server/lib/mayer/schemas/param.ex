defmodule Mayer.Schemas.Param do
  use Ecto.Schema
  import Ecto.Changeset

  alias Mayer.Schemas.Api

  schema "params" do
    belongs_to(:api, Api)
    field(:key, :string)
    field(:type, :string)

    timestamps()
  end

  @doc false
  def changeset(param, attrs) do
    param
    |> cast(attrs, [:key, :type, :api_id])
    |> validate_required([:key, :type])
  end
end
