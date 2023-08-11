defmodule Mayer.Schemas.Field do
  use Ecto.Schema
  import Ecto.Changeset

  alias Mayer.Schemas.{
    Schema
  }

  schema "fields" do
    belongs_to(:schema, Schema)
    field(:formula, :string)
    field(:name, :string)
    field(:null_percentage, :integer)
    field(:code_type, :string)
    field(:option_from, :string)
    field(:option_to, :string)
    field(:option_min, :integer)
    field(:option_max, :integer)
    field(:option_format, :string)
    field(:option_decimals, :integer)
    field(:option_schema_name, :string)
    field(:option_field_name, :string)
    field(:option_custom, :string)

    timestamps()
  end

  @doc false
  def changeset(field, attrs) do
    field
    |> cast(attrs, [
      :name,
      :null_percentage,
      :formula,
      :schema_id,
      :code_type,
      :option_from,
      :option_to,
      :option_min,
      :option_max,
      :option_format,
      :option_decimals,
      :option_schema_name,
      :option_field_name,
      :option_custom
    ])
    |> validate_required([:name, :schema_id, :code_type])
  end
end
