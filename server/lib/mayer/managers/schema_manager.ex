defmodule Mayer.Managers.SchemaManager do
  import Ecto.Query, warn: false

  alias Mayer.{
    Repo,
    Schemas.Schema
  }

  def get_schema_list(user_id, opts \\ []) do
    search =
      case Keyword.get(opts, :search) do
        result -> "%#{result}%"
        nil -> ""
      end

    Schema
    |> _filter_by_project_id(Keyword.get(opts, :project_id))
    |> where([s], s.user_id == ^user_id)
    |> where([p], like(p.name, ^search))
    |> order_by([s], desc: s.id)
    |> Repo.paginate(opts)
  end

  defp _filter_by_project_id(query, nil), do: query

  defp _filter_by_project_id(query, project_id),
    do: where(query, [s], s.project_id == ^project_id)

  def get_schema!(schema_id, user_id) do
    Schema
    |> where([s], s.id == ^schema_id)
    |> where([s], s.user_id == ^user_id)
    |> Repo.one!()
  end

  def create_schema_and_field() do
  end

  def upsert_schema!(%Schema{} = schema, attrs) do
    case Map.get(schema, :id) do
      nil -> %Schema{}
      _value -> schema
    end
    |> Schema.changeset(attrs)
    |> Repo.insert_or_update!()
  end

  def delete_schema(schema_ids, user_id) do
    Schema
    |> where([s], s.id in ^schema_ids)
    |> where([s], s.user_id == ^user_id)
    |> Repo.delete_all()
  end

  def exists_schema?(user_id, schema_id) do
    Schema
    |> where([s], s.id == ^schema_id)
    |> where([s], s.user_id == ^user_id)
    |> Repo.exists?()
  end
end
