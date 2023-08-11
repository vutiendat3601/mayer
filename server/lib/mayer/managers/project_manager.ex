defmodule Mayer.Managers.ProjectManager do
  import Ecto.Query, warn: false

  alias Mayer.{
    Repo,
    Schemas.Project
  }

  def get_project_list(user_id, opts \\ []) do
    search =
      case Keyword.get(opts, :search) do
        result -> "%#{result}%"
        nil -> ""
      end

    Project
    |> where([p], p.user_id == ^user_id)
    |> where([p], like(p.name, ^search))
    |> order_by([p], desc: p.id)
    |> Repo.paginate(Keyword.take(opts, [:page, :page_size]))
  end

  def get_project!(id, user_id) do
    Project
    |> where([p], p.id == ^id)
    |> where([p], p.user_id == ^user_id)
    |> Repo.one!()
  end

  def upsert_project!(%Project{} = project, attrs) do
    case Map.get(project, :id) do
      nil -> %Project{}
      _value -> project
    end
    |> Project.changeset(attrs)
    |> Repo.insert_or_update!()
  end

  def delete_project(project_ids, user_id) do
    Project
    |> where([p], p.id in ^project_ids)
    |> where([p], p.user_id == ^user_id)
    |> Repo.delete_all()
  end

  def exists_project?(project_id, user_id) do
    Project
    |> where([p], p.id == ^project_id)
    |> where([p], p.user_id == ^user_id)
    |> Repo.exists?()
  end
end
