defmodule MayerWeb.ProjectView do
  use MayerWeb, :view

  alias MayerWeb.ProjectView

  def render("list_projects.json", %{list: list}) do
    %{
      errors: [],
      data: render_many(list, ProjectView, "project.json"),
      page: list.page_number,
      page_size: list.page_size,
      total_page: list.total_pages
    }
  end

  def render("show_project.json", %{project: project}) do
    %{
      errors: [],
      data: render("project.json", %{project: project})
    }
  end

  def render("project.json", %{project: project}) do
    %{
      id: project.id,
      user_id: project.user_id,
      name: project.name,
      inserted_at: project.inserted_at
    }
  end

  def render("delete_project.json", _) do
    %{
      errors: [],
      data: [],
      code: "c_deleted_successfully",
      message: "Deleted Successfully"
    }
  end
end
