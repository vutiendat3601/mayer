defmodule Mayer.Managers.DatasetManager do
  import Ecto.Query, warn: false

  alias Mayer.{
    Repo,
    Schemas.Dataset
  }

  def get_dataset_list(user_id, opts \\ []) do
    search =
      case Keyword.get(opts, :search) do
        result -> "%#{result}%"
        nil -> ""
      end

    Dataset
    |> _filter_by_project_id(Keyword.get(opts, :project_id))
    |> where([d], d.user_id == ^user_id)
    |> where([p], like(p.name, ^search))
    |> order_by([d], desc: d.id)
    |> Repo.paginate(opts)
  end

  defp _filter_by_project_id(query, nil), do: query

  defp _filter_by_project_id(query, project_id),
    do: where(query, [s], s.project_id == ^project_id)

  def get_dataset!(dataset_id, user_id) do
    Dataset
    |> where([d], d.id == ^dataset_id)
    |> where([d], d.user_id == ^user_id)
    |> Repo.one!()
  end

  def get_dataset_by_collection_name!(collection_name, user_id) do
    Dataset
    |> where([d], d.id == ^collection_name)
    |> where([d], d.user_id == ^user_id)
    |> Repo.one!()
  end

  def upsert_dataset(%Dataset{} = dataset, attrs) do
    case Map.get(dataset, :id) do
      nil -> %Dataset{}
      _value -> dataset
    end
    |> Dataset.changeset(attrs)
    |> Repo.insert_or_update!()
  end

  def delete_dataset!(dataset_id, user_id) do
    Dataset
    |> where([d], d.id == ^dataset_id)
    |> where([d], d.user_id == ^user_id)
    |> Repo.one!()
    |> Repo.delete!()
  end

  def exists_dataset?(user_id, dataset_id) do
    Dataset
    |> where([s], s.id == ^dataset_id)
    |> where([s], s.user_id == ^user_id)
    |> Repo.exists?()
  end
end
