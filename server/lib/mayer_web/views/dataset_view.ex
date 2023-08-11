defmodule MayerWeb.DatasetView do
  use MayerWeb, :view

  alias MayerWeb.DatasetView

  def render("dataset.json", %{dataset: dataset}) do
    %{
      id: dataset.id,
      name: dataset.name,
      schema_id: dataset.schema_id,
      user_id: dataset.user_id,
      project_id: dataset.project_id,
      collection_name: dataset.collection_name,
      inserted_at: dataset.inserted_at
    }
  end

  def render("dataset_list.json", %{list: list}) do
    %{
      error: [],
      data: render_many(list, DatasetView, "dataset.json"),
      page: list.page_number,
      page_size: list.page_size,
      total_page: list.total_pages
    }
  end

  def render("show_dataset.json", %{dataset: dataset}) do
    %{
      error: [],
      data: render("dataset.json", %{dataset: dataset})
    }
  end

  def render("delete_dataset.json", _) do
    %{
      error: [],
      data: [],
      code: "c_deleted_successfully",
      message: "Deleted Successfully"
    }
  end
end
