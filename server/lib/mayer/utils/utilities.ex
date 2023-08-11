defmodule Mayer.Utils.Utilities do
  alias Mayer.{
    Auth.Guardian,
    Handlers.GenerateData,
    Error
  }

  def get_user_id(conn) do
    guardian = Guardian.Plug.current_claims(conn)

    with guardian when not is_nil(guardian) <- guardian do
      convert_param_int(guardian["sub"])
    end
  end

  def convert_param_int(param) when is_binary(param) do
    case Integer.parse(param) do
      {number, ""} -> number
      _ -> nil
    end
  end

  def convert_param_int(param) do
    param
  end

  def create_row_data(schema_structures, index) do
    schema_structures
    |> Enum.map(fn x ->
      if Map.get(x, :code_type) == "type_row_number" do
        Map.merge(x, %{index: index})
      else
        x
      end
      |> GenerateData.generate_data()
    end)
  end

  def to_csv(data) do
    col_sep = ","

    row_values =
      for row <- data do
        row
        |> Enum.map(fn x ->
          Map.to_list(x)
        end)
        |> List.flatten()
        |> Keyword.values()
        |> Enum.join(col_sep)
      end

    header =
      List.first(data)
      |> Enum.map(fn x ->
        Map.to_list(x)
      end)
      |> List.flatten()
      |> Keyword.keys()
      |> Enum.join(col_sep)

    List.insert_at(row_values, 0, header)
  end

  def to_sql(data, table_name) do
    col_sep = ", "

    header =
      List.first(data)
      |> Enum.map(fn x ->
        Map.to_list(x)
      end)
      |> List.flatten()
      |> Keyword.keys()
      |> Enum.join(col_sep)

    if table_name == nil do
      raise Error, code: Error.c_REQUIRED_FIELD(), reason: "table_name"
    end

    insert =
      ("insert into `" <> table_name <> "` (" <> header <> ") values (")

    row_values =
      for row <- data do
        row
        |> IO.inspect(label: "Name")
        |> Enum.map(fn x ->
          Map.to_list(x)
        end)
        |> List.flatten()
        |> Keyword.values()
        |> Enum.join(col_sep)
      end

    for i <- row_values do
      insert <> i <> ") \n"
    end
  end

  def to_json(data) do
    for row <- data do
      row
      |> Enum.map(fn x ->
        Map.to_list(x)
      end)
      |> List.flatten()
      |> Enum.into(%{})
    end
  end
end
