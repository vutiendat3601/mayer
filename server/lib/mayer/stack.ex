defmodule Mayer.Stack do
  use GenServer

  alias Mayer.{
    Utils.Utilities
  }

  # Client APIs

  def start_link(_opts \\ []) do
    IO.inspect("Start GenServer for dataset")
    GenServer.start_link(__MODULE__, :ok, name: :dataset_generator)
  end

  def bulk_mongodb(schema_structures, row_number) do
    mongo_collection = "mayer_collection_" <> to_string(:os.system_time(:millisecond))

    GenServer.cast(
      :dataset_generator,
      {:bulk_mongodb, {mongo_collection, schema_structures, row_number}}
    )

    mongo_collection
  end

  def write_file(schema_structure, row_number, file, table_name) do
    file_name = "mayer_file_" <> to_string(:os.system_time(:millisecond)) <> ".#{file}"

    GenServer.cast(
      :dataset_generator,
      {:write_file, {file_name, schema_structure, row_number, file, table_name}}
    )

    file_name
  end

  # Server Callbacks

  @impl true
  def init(:ok) do
    {:ok, []}
  end

  # API case:
  # - Generate dataset - Bulk MongoDB -> MongoDB collection
  # - Generate dataset - Write file -> File name

  @impl true
  def handle_cast({:bulk_mongodb, {mongodb_collection, schema_structures, row_number}}, state) do
    # 1. Generate dataset
    # 2. Bulk Mongodb [Option]
    IO.inspect(state, label: "State")

    Mongo.insert_one!(:mongo, "dataset_generator", %{
      dataset_generator: mongodb_collection,
      status: "solving"
    })

    for i <- 0..row_number, i > 0 do
      Utilities.create_row_data(schema_structures, i)
    end
    |> Utilities.to_json()
    |> Stream.map(fn
      i -> Mongo.BulkOps.get_insert_one(i)
    end)
    |> Mongo.OrderedBulk.write(:mongo, mongodb_collection)
    |> Stream.run()

    Mongo.find_one_and_update(
      :mongo,
      "dataset_generator",
      %{dataset_generator: mongodb_collection},
      %{
        "$set": %{status: "done"}
      }
    )

    IO.inspect("end bulk mongodb")

    # Process.send_after(self(), {:clean, mongodb_collection}, 10000)

    {:noreply, [mongodb_collection | state]}
  end

  @impl true
  def handle_cast(
        {:write_file, {file_name, schema_structures, row_number, file, table_name}},
        state
      ) do
    # 1. Generate dataset
    # 2. Write file [Option]
    IO.inspect(state, label: "State")

    Mongo.insert_one!(:mongo, "dataset_generator", %{
      dataset_generator: file_name,
      status: "solving"
    })

    data =
      for i <- 0..row_number, i > 0 do
        Utilities.create_row_data(schema_structures, i)
      end

    case file do
      "json" ->
        File.write!(
          "asset/#{file_name}",
          Utilities.to_json(data) |> Poison.encode!()
        )

      "csv" ->
        File.write!(
          "asset/#{file_name}",
          Utilities.to_csv(data) |> Enum.join("\n")
        )

      "sql" ->
        File.write!(
          "asset/#{file_name}",
          Utilities.to_sql(data, table_name) |> Enum.join("\n")
        )

      _ ->
        nil
    end

    Mongo.find_one_and_update(:mongo, "dataset_generator", %{dataset_generator: file_name}, %{
      "$set": %{status: "done"}
    })

    IO.inspect("end write file")

    # Process.send_after(self(), {:clean, file_name}, 10000)

    {:noreply, [file_name | state]}
  end

  # @impl true
  # def handle_info({:clean, file_name}, state) do
  #   IO.inspect("Handle info clean")

  #   {:noreply, Enum.reject(state, fn {key, _val} -> key == file_name end)}
  # end
end
