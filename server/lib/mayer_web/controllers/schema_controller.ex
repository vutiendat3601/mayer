defmodule MayerWeb.SchemaController do
  use MayerWeb, :controller

  alias Mayer.{
    Managers.SchemaManager,
    Managers.ProjectManager,
    Validator,
    Error,
    Schemas.Schema
  }

  alias MayerWeb.{
    SchemaView
  }

  @api_inject :get_schema_list
  @api_param_paginate_schema %{
    page: [
      type: :integer
    ],
    page_size: [
      type: :integer
    ],
    project_id: [
      type: :integer
    ],
    search: [
      type: :string
    ]
  }
  def get_schema_list(conn, params, %{user_id: user_id}) do
    params =
      @api_param_paginate_schema
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:page, :page_size, :project_id, :search])
      |> Map.to_list()

    list =
      SchemaManager.get_schema_list(
        user_id,
        params
      )

    conn
    |> put_view(SchemaView)
    |> render("schema_list.json", list: list)
  end

  @api_inject :get_schema
  @api_param_schema %{
    id: [
      type: :integer,
      required: true
    ]
  }
  def get_schema(conn, params, %{user_id: user_id}) do
    %{id: id} =
      @api_param_schema
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    schema = SchemaManager.get_schema!(id, user_id)

    conn
    |> put_view(SchemaView)
    |> render("show_schema.json", schema: schema)
  end

  @api_inject :create_schema
  @api_param_schema %{
    name: [
      type: :string,
      required: true
    ],
    project_id: [
      type: :integer,
      required: false
    ]
  }
  def create_schema(conn, params, %{user_id: user_id}) do
    params =
      @api_param_schema
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    _exists_project!(Map.get(params, :project_id), user_id)

    new_schema = SchemaManager.upsert_schema!(%Schema{}, Map.merge(params, %{user_id: user_id}))

    conn
    |> put_view(SchemaView)
    |> render("show_schema.json", schema: new_schema)
  end

  @api_inject :update_schema
  @api_param_schema %{
    id: [
      type: :integer,
      required: true
    ],
    name: [
      type: :string,
      required: false
    ],
    project_id: [
      type: :integer,
      required: false
    ]
  }
  def update_schema(conn, params, %{user_id: user_id}) do
    params =
      @api_param_schema
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    _exists_project!(Map.get(params, :project_id), user_id)

    schema = SchemaManager.get_schema!(Map.get(params, :id), user_id)

    new_schema = SchemaManager.upsert_schema!(schema, Map.take(params, [:name, :project_id]))

    conn
    |> put_view(SchemaView)
    |> render("show_schema.json", schema: new_schema)
  end

  @api_inject :delete_schema
  @api_param_schema %{
    ids: [
      type: {:array, :integer},
      required: true
    ]
  }
  def delete_schema(conn, params, %{user_id: user_id}) do
    %{ids: ids} =
      @api_param_schema
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    for id <- ids do
      if SchemaManager.exists_schema?(user_id, id) == false do
        raise Error, code: Error.c_NOT_FOUND(), reason: "schema_id"
      end
    end

    {number_record, _} = SchemaManager.delete_schema(ids, user_id)

    if number_record == length(ids) do
      conn
      |> put_view(SchemaView)
      |> render("delete_schema.json")
    else
      raise Error, code: Error.c_INTERNAL_SERVER_ERROR(), reason: nil
    end
  end

  defp _exists_project!(project_id, user_id) do
    unless is_nil(project_id) do
      unless ProjectManager.exists_project?(project_id, user_id) do
        raise Error, code: Error.c_NOT_FOUND(), reason: "project_id"
      end
    end
  end
end
