defmodule MayerWeb.ProjectController do
  use MayerWeb, :controller

  alias Mayer.{
    Managers.ProjectManager,
    Validator,
    Error,
    Schemas.Project
  }

  alias MayerWeb.{
    ProjectView
  }

  @api_inject :get_project_list
  @api_param_paginate_project %{
    page: [
      type: :integer
    ],
    page_size: [
      type: :integer
    ],
    search: [
      type: :string
    ]
  }
  def get_project_list(conn, params, %{user_id: user_id}) do
    params =
      @api_param_paginate_project
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:page, :page_size, :search])
      |> Map.to_list()

    list =
      ProjectManager.get_project_list(
        user_id,
        params
      )

    conn
    |> put_view(ProjectView)
    |> render("list_projects.json", list: list)
  end

  @api_inject :get_project
  @api_param_project %{
    id: [
      type: :integer,
      required: true
    ]
  }
  def get_project(conn, params, %{user_id: user_id}) do
    %{id: id} =
      @api_param_project
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    project = ProjectManager.get_project!(id, user_id)

    conn
    |> put_view(ProjectView)
    |> render("show_project.json", project: project)
  end

  @api_inject :create_project
  @api_param_project %{
    name: [
      type: :string,
      required: true
    ]
  }
  def create_project(conn, params, %{user_id: user_id}) do
    params =
      @api_param_project
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:name])

    new_project =
      ProjectManager.upsert_project!(
        %Project{},
        Map.merge(params, %{user_id: user_id})
      )

    conn
    |> put_view(ProjectView)
    |> render("show_project.json", project: new_project)
  end

  @api_inject :update_project
  @api_param_project %{
    id: [
      type: :integer,
      required: true
    ],
    name: [
      type: :string,
      required: true
    ]
  }
  def update_project(conn, params, %{user_id: user_id}) do
    params =
      @api_param_project
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    project = ProjectManager.get_project!(Map.get(params, :id), user_id)

    new_project = ProjectManager.upsert_project!(project, Map.take(params, [:name]))

    conn
    |> put_view(ProjectView)
    |> render("show_project.json", project: new_project)
  end

  @api_inject :delete_project
  @api_param_project %{
    ids: [
      type: {:array, :integer},
      required: true
    ]
  }
  def delete_project(conn, params, %{user_id: user_id}) do
    %{ids: ids} =
      @api_param_project
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    for id <- ids do
      if ProjectManager.exists_project?(id, user_id) == false do
        raise Error, code: Error.c_NOT_FOUND(), reason: "project_id"
      end
    end

    {number_record, _} = ProjectManager.delete_project(ids, user_id)

    if number_record == length(ids) do
      conn
      |> put_view(ProjectView)
      |> render("delete_project.json")
    else
      raise Error, code: Error.c_INTERNAL_SERVER_ERROR(), reason: nil
    end
  end
end
