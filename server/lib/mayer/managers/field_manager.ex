defmodule Mayer.Managers.FieldManager do
  import Ecto.Query, warn: false

  alias Mayer.{
    Repo,
    Schemas.Field
  }

  def get_field_list(schema_id) do
    Field
    |> where([f], f.schema_id == ^schema_id)
    |> order_by([f], asc: f.id)
    |> Repo.all()
  end

  def get_field!(schema_id, field_id) do
    Field
    |> where([f], f.schema_id == ^schema_id)
    |> where([f], f.id == ^field_id)
    |> Repo.one!()
  end

  def upsert_field!(%Field{} = field, attrs) do
    case Map.get(field, :id) do
      nil -> %Field{}
      _value -> field
    end
    |> Field.changeset(attrs)
    |> Repo.insert_or_update!()
  end

  def delete_fields!(schema_id, field_ids) do
    Field
    |> where([f], f.id in ^field_ids)
    |> where([f], f.schema_id == ^schema_id)
    |> Repo.delete_all()
  end

  def exists_field?(field_id, schema_id) do
    Field
    |> where([p], p.id == ^field_id)
    |> where([p], p.schema_id == ^schema_id)
    |> Repo.exists?()
  end
end
