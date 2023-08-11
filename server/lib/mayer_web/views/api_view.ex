defmodule MayerWeb.ApiView do
  use MayerWeb, :view

  alias MayerWeb.{
    ApiView
  }

  def render("param.json", %{api: param}) do
    %{
      id: param.id,
      key: param.key,
      type: param.type,
      inserted_at: param.inserted_at
    }
  end

  def render("api.json", %{api: api}) do
    %{
      id: api.id,
      name: api.name,
      method: api.method,
      path: api.path,
      api_key: api.api_key,
      user_id: api.user_id,
      params: render_many(api.params, ApiView, "param.json"),
      dataset_id: api.dataset_id,
      schema_id: api.schema_id,
      project_id: api.project_id,
      inserted_at: api.inserted_at
    }
  end

  def render("api_list.json", %{api: api}) do
    %{
      id: api.id,
      name: api.name,
      method: api.method,
      path: api.path,
      user_id: api.user_id,
      dataset_id: api.dataset_id,
      schema_id: api.schema_id,
      project_id: api.project_id,
      inserted_at: api.inserted_at
    }
  end

  def render("show_api.json", %{api: api}) do
    %{error: [], data: render("api.json", %{api: api})}
  end

  def render("api_list.json", %{list: list}) do
    %{
      error: [],
      data: render_many(list, ApiView, "api_list.json"),
      page: list.page_number,
      page_size: list.page_size,
      total_page: list.total_pages
    }
  end

  def render("delete_api.json", _) do
    %{
      errors: [],
      data: [],
      code: "c_deleted_successfully",
      message: "Deleted Successfully"
    }
  end
end
