defmodule MayerWeb.GenerateDataView do
  use MayerWeb, :view

  def render("show_result.json", %{result: result}) do
    %{
      error: [],
      data: result
    }
  end

  def render("status_is_not_exist.json", _) do
    %{
      error: [
        %{message: "Not exist", code: "c_not_exist"}
      ],
      data: []
    }
  end

  def render("status_is_solving.json", _) do
    %{
      error: [
        %{message: "Solving", code: "c_solving"}
      ],
      data: []
    }
  end

  def render("status_is_completing.json", _) do
    %{
      error: [],
      data: [
        %{message: "Conpleting", code: "c_completing"}
      ]
    }
  end

  def render("remove_file.json", _) do
    %{
      error: [],
      data: [
        %{message: "File remove successfully", code: "c_file_remove_successfully"}
      ]
    }
  end
end
