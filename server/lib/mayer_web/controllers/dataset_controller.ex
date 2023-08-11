defmodule MayerWeb.DatasetController do
  use MayerWeb, :controller

  alias MayerWeb.{
    DatasetView
  }

  alias Mayer.{
    Validator,
    Managers.DatasetManager,
    Managers.SchemaManager,
    Managers.ProjectManager,
    Error
  }

  @api_inject :get_dataset_list
  @api_param_paginate_dataset %{
    page: [
      type: :integer
    ],
    page_size: [
      type: :integer
    ],
    search: [
      type: :string
    ],
    project_id: [
      type: :integer
    ]
  }
  def get_dataset_list(conn, params, %{user_id: user_id}) do
    params =
      @api_param_paginate_dataset
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:page, :page_size, :project_id, :search])
      |> Map.to_list()

    list = DatasetManager.get_dataset_list(user_id, params)

    conn
    |> put_view(DatasetView)
    |> render("dataset_list.json", list: list)
  end

  @api_inject :get_dataset
  @api_param_get_dataset %{
    id: [
      type: :integer,
      required: true
    ]
  }
  def get_dataset(conn, params, %{user_id: user_id}) do
    %{id: id} =
      @api_param_get_dataset
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    dataset = DatasetManager.get_dataset!(id, user_id)

    conn
    |> put_view(DatasetView)
    |> render("show_dataset.json", dataset: dataset)
  end

  @api_inject :update_dataset
  @api_param_update_dataset %{
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
    ],
    schema_id: [
      type: :string,
      required: false
    ]
  }
  def update_dataset(conn, params, %{user_id: user_id}) do
    params =
      @api_param_update_dataset
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:schema_id, :id, :name, :project_id])

    _exists_project!(Map.get(params, :project_id), user_id)

    _exists_schema!(Map.get(params, :schema_id), user_id)

    dataset = DatasetManager.get_dataset!(Map.get(params, :id), user_id)

    new_dataset =
      DatasetManager.upsert_dataset(dataset, Map.take(params, [:name, :project_id, :schema_id]))

    conn
    |> put_view(DatasetView)
    |> render("show_dataset.json", dataset: new_dataset)
  end

  @api_inject :delete_dataset
  @api_param_delete_dataset %{
    ids: [
      type: {:array, :integer},
      required: true
    ]
  }
  def delete_dataset(conn, params, %{user_id: user_id}) do
    %{ids: ids} =
      @api_param_delete_dataset
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    for id <- ids do
      %{collection_name: collection_name} = DatasetManager.delete_dataset!(id, user_id)

      Mongo.drop_collection(:mongo, collection_name)
    end

    conn
    |> put_view(DatasetView)
    |> render("delete_dataset.json")
  end

  defp _exists_project!(project_id, user_id) do
    unless is_nil(project_id) do
      unless ProjectManager.exists_project?(project_id, user_id) do
        raise Error, code: Error.c_NOT_FOUND(), reason: "project_id"
      end
    end
  end

  defp _exists_schema!(schema_id, user_id) do
    unless is_nil(schema_id) do
      unless SchemaManager.exists_schema?(schema_id, user_id) do
        raise Error, code: Error.c_NOT_FOUND(), reason: "schema_id"
      end
    end
  end
end
