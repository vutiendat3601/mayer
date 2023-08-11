defmodule MayerWeb.SchemaView do
  use MayerWeb, :view

  alias MayerWeb.{
    SchemaView
  }

  def render("schema_list.json", %{list: list}) do
    %{
      errors: [],
      data: render_many(list, SchemaView, "schema.json"),
      page: list.page_number,
      page_size: list.page_size,
      total_page: list.total_pages
    }
  end

  def render("show_schema.json", %{schema: schema}) do
    %{
      errors: [],
      data: render("schema.json", %{schema: schema})
    }
  end

  def render("schema.json", %{schema: schema}) do
    %{
      id: schema.id,
      user_id: schema.user_id,
      project_id: schema.project_id,
      name: schema.name,
      inserted_at: schema.inserted_at
    }
  end

  def render("delete_schema.json", _) do
    %{
      error: [],
      data: [],
      code: "c_deleted_successfully",
      message: "Deleted Successfully"
    }
  end
end
