defmodule MayerWeb.ErrorView do
  use MayerWeb, :view

  alias Mayer.Error

  def render("error.json", %{error: %Error{} = error}), do: %{errors: [error]}

  def render("error.json", %{error: error}), do: %{errors: error}

  def render("500.json", _assigns) do
    %{errors: [%Error{code: Error.c_INTERNAL_SERVER_ERROR()}]}
  end

  def template_not_found(_template, _assigns) do
    %{errors: [%Error{code: Error.c_TEMPLATE_NOT_FOUND()}]}
  end
end
