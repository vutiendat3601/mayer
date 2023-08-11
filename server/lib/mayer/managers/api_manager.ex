defmodule Mayer.Managers.ApiManager do
  import Ecto.Query, warn: false

  alias Mayer.{
    Repo,
    Schemas.Api
  }

  def get_api_list(user_id, opts \\ []) do
    search =
      case Keyword.get(opts, :search) do
        result -> "%#{result}%"
        nil -> ""
      end

    Api
    |> _filter_by_project_id(Keyword.get(opts, :project_id))
    |> where([a], a.user_id == ^user_id)
    |> order_by([a], asc: a.id)
    |> Repo.paginate(opts)
  end

  defp _filter_by_project_id(query, nil), do: query

  defp _filter_by_project_id(query, project_id),
    do: where(query, [a], a.project_id == ^project_id)

  def get_api!(user_id, api_id) do
    Api
    |> where([a], a.id == ^api_id)
    |> where([a], a.user_id == ^user_id)
    |> Repo.one!()
  end

  def get_api_by_api_key!(path, api_key) do
    Api
    |> where([a], a.api_key == ^api_key)
    |> where([a], a.path == ^path)
    |> Repo.one!()
  end

  def upsert_api!(%Api{} = api, attrs) do
    case Map.get(api, :id) do
      nil -> %Api{}
      _value -> api
    end
    |> Api.changeset(attrs)
    |> Repo.insert_or_update!()
  end

  def preload_api(api) do
    Repo.preload(api, [:params])
  end

  def delete_api(user_id, api_ids) do
    Api
    |> where([a], a.id in ^api_ids)
    |> where([a], a.user_id == ^user_id)
    |> Repo.delete_all()
  end

  def update_api_key!(%Api{} = api, api_key) do
    api
    |> Api.changeset(api_key)
    |> Repo.update!()
  end

  def exists_api?(user_id, api_id) do
    Api
    |> where([s], s.id == ^api_id)
    |> where([s], s.user_id == ^user_id)
    |> Repo.exists?()
  end
end
