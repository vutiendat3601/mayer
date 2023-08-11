defmodule MayerWeb.GenerateDataController do
  use MayerWeb, :controller

  alias Mayer.{
    Managers.FieldManager,
    Managers.DatasetManager,
    Schemas.Dataset,
    Validator,
    Stack,
    Utils.Utilities,
    MongoRepo
  }

  alias MayerWeb.{
    GenerateDataView,
    DatasetView
  }

  @api_param_preview_data %{
    schema_id: [
      type: :integer,
      required: true
    ],
    file: [
      type: :string,
      required: true
    ],
    table_name: [
      type: :string
    ]
  }
  def preview_data(conn, params) do
    params =
      @api_param_preview_data
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:table_name, :file, :schema_id])

    schema_structures =
      FieldManager.get_field_list(Map.get(params, :schema_id))
      |> Enum.map(
        &Map.take(&1, [
          :name,
          :code_type,
          :option_from,
          :option_to,
          :option_min,
          :option_max,
          :option_format,
          :option_decimals,
          :option_schema_name,
          :option_field_name,
          :option_custion
        ])
      )

    data =
      for i <- 0..20, i > 0 do
        Utilities.create_row_data(schema_structures, i)
      end

    result =
      case Map.get(params, :file) do
        "json" ->
          Utilities.to_json(data) |> Poison.encode!()

        "csv" ->
          Utilities.to_csv(data) |> Enum.join(" \n ")

        "sql" ->
          Utilities.to_sql(data, Map.get(params, :table_name)) |> Enum.join(" \n ")

        _ ->
          nil
      end

    conn
    |> put_view(GenerateDataView)
    |> render("show_result.json", result: result)
  end

  @api_param_write_file %{
    schema_id: [
      type: :integer,
      required: true
    ],
    file: [
      type: :string,
      required: true
    ],
    table_name: [
      type: :string
    ],
    row_number: [
      type: :integer,
      required: true
    ]
  }
  def write_file(conn, params) do
    params =
      @api_param_write_file
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:table_name, :file, :row_number, :schema_id])

    schema_structures =
      FieldManager.get_field_list(Map.get(params, :schema_id))
      |> Enum.map(
        &Map.take(&1, [
          :name,
          :code_type,
          :option_from,
          :option_to,
          :option_min,
          :option_max,
          :option_format,
          :option_decimals,
          :option_schema_name,
          :option_field_name,
          :option_custion
        ])
      )

    file_name =
      Stack.write_file(
        schema_structures,
        Map.get(params, :row_number),
        Map.get(params, :file),
        Map.get(params, :table_name)
      )
      |> IO.inspect(label: "file path")

    IO.inspect("end api write file")

    conn
    |> put_view(GenerateDataView)
    |> render("show_result.json", result: file_name)
  end

  @api_param_download_file %{
    file_name: [
      type: :string,
      required: true
    ]
  }
  def download_file(conn, params) do
    %{file_name: file_name} =
      @api_param_download_file
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    file = Mongo.find_one(:mongo, "dataset_generator", %{dataset_generator: file_name})

    if file == nil do
      conn
      |> put_view(GenerateDataView)
      |> render("status_is_not_exist.json")
    else
      if Map.get(file, "status") == "solving" do
        conn
        |> put_view(GenerateDataView)
        |> render("status_is_solving.json")
      else
        conn
        |> Plug.Conn.send_file(200, "asset/#{Map.get(file, "dataset_generator")}")
      end
    end
  end

  @api_param_remove_file %{
    file_name: [
      type: :string,
      required: true
    ]
  }
  def remove_file(conn, params) do
    %{file_name: file_name} =
      @api_param_remove_file
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    Mongo.delete_one!(:mongo, "dataset_generator", %{dataset_generator: file_name})

    File.rm!("asset/#{file_name}")

    conn
    |> put_view(GenerateDataView)
    |> render("remove_file.json")
  end

  @api_inject :bulk_mongodb
  @api_param_bulk_mongodb %{
    schema_id: [
      type: :integer,
      required: true
    ],
    row_number: [
      type: :integer,
      required: true
    ],
    name: [
      type: :string,
      required: true
    ],
    project_id: [
      type: :integer,
      required: false
    ]
  }
  def bulk_mongodb(conn, params, %{user_id: user_id}) do
    params =
      @api_param_bulk_mongodb
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:schema_id, :row_number, :name, :project_id])

    schema_structures =
      FieldManager.get_field_list(Map.get(params, :schema_id))
      |> Enum.map(
        &Map.take(&1, [
          :name,
          :code_type,
          :option_from,
          :option_to,
          :option_min,
          :option_max,
          :option_format,
          :option_decimals,
          :option_schema_name,
          :option_field_name,
          :option_custion
        ])
      )

    collection_name = Stack.bulk_mongodb(schema_structures, Map.get(params, :row_number))

    new_dataset =
      DatasetManager.upsert_dataset(
        %Dataset{},
        Map.merge(params, %{user_id: user_id, collection_name: collection_name})
      )

    IO.inspect("end api bulk mongodb")

    conn
    |> put_view(DatasetView)
    |> render("show_dataset.json", dataset: new_dataset)
  end

  @api_param_check_bulk_mongodb %{
    collection_name: [
      type: :string,
      required: true
    ]
  }
  def check_bulk_mongodb(conn, params) do
    %{collection_name: collection_name} =
      @api_param_check_bulk_mongodb
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    collection =
      Mongo.find_one(:mongo, "dataset_generator", %{dataset_generator: collection_name})

    if collection == nil do
      conn
      |> put_view(GenerateDataView)
      |> render("status_is_not_exist.json")
    else
      if Map.get(collection, "status") == "solving" do
        conn
        |> put_view(GenerateDataView)
        |> render("status_is_solving.json")
      else
        conn
        |> put_view(GenerateDataView)
        |> render("status_is_completing.json")
      end
    end
  end
end
