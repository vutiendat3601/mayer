defmodule MayerWeb.FieldView do
  use MayerWeb, :view

  alias MayerWeb.FieldView

  def render("field_list.json", %{list: list}) do
    %{
      errors: [],
      data: render_many(list, FieldView, "field.json")
    }
  end

  def render("field.json", %{field: field}) do
    %{
      id: field.id,
      name: field.name,
      schema_id: field.schema_id,
      null_percentage: field.null_percentage,
      formula: field.formula,
      code_type: field.code_type,
      option_from: field.option_from,
      option_to: field.option_to,
      option_min: field.option_min,
      option_max: field.option_max,
      option_format: field.option_format,
      option_decimals: field.option_decimals,
      option_name_schema: field.option_schema_name,
      option_name_field: field.option_field_name,
      option_custom: field.option_custom
    }
  end

  def render("show_field.json", %{field: field}) do
    %{
      errors: [],
      data: render("field.json", %{field: field})
    }
  end

  def render("delete_field.json", _) do
    %{
      error: [],
      data: [],
      code: "c_deleted_successfully",
      message: "Deleted Successfully"
    }
  end

  def render("insert_many_fields.json", %{fields: fields}) do
    %{
      error: [],
      data: render_many(fields, FieldView, "field.json")
    }
  end
end
