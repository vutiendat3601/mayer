defmodule MayerWeb.ExecuteApiController do
  use MayerWeb, :controller

  alias Mayer.{
    Error,
    Validator,
    Managers.DatasetManager,
    Managers.ApiManager
  }

  @api_param_execute_param %{
    path: [
      type: :string,
      required: true
    ],
    api_key: [
      type: :string,
      required: true
    ]
  }
  def execute_api(conn, params) do
    %{path: path, api_key: api_key} =
      @api_param_execute_param
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    api = ApiManager.get_api_by_api_key!(path, api_key)

    preload_api = ApiManager.preload_api(api)

    validators_params =
      Enum.map(Map.get(preload_api, :params), fn p ->
        Map.new("#{p.key}": [type: String.to_atom(p.type)])
        |> Map.to_list()
      end)
      |> List.flatten()
      |> Enum.into(%{})

    params =
      validators_params
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> IO.inspect(label: "Params")

    result =
      case Map.get(conn, :method) do
        "GET" ->
          _method_get(
            params,
            Map.get(preload_api, :dataset_id) |> IO.inspect(label: "dataset_id"),
            Map.get(preload_api, :user_id)
          )

        "POST" ->
          _method_post(params, Map.get(preload_api, :dataset_id), Map.get(preload_api, :user_id))

        "PUT" ->
          _method_put(params, Map.get(preload_api, :dataset_id), Map.get(preload_api, :user_id))

        "DELETE" ->
          _method_delete(
            params,
            Map.get(preload_api, :dataset_id),
            Map.get(preload_api, :user_id)
          )
      end

    conn |> json(result)
  end

  defp _method_get(params, dataset_id, user_id) do
    if dataset_id == nil do
      params
    else
      _exists_dataset!(dataset_id, user_id)

      %{collection_name: collection_name} = DatasetManager.get_dataset!(dataset_id, user_id)

      result =
        Mongo.find(:mongo, collection_name, params)
        |> Enum.to_list()
        |> Enum.map(fn x ->
          Map.to_list(x)
          |> List.delete_at(0)
          |> Enum.into(%{})
        end)

      if result != [] do
        result
      else
        raise Error, code: Error.c_NO_RESULT_FOUND(), reason: nil
      end
    end
  end

  defp _method_post(params, dataset_id, user_id) do
    if dataset_id == nil do
      raise Error, code: Error.c_NOT_FOUND(), reason: "dataset"
    else
      _exists_dataset!(dataset_id, user_id)

      %{collection_name: collection_name} = DatasetManager.get_dataset!(dataset_id, user_id)

      check_empty =
        Mongo.find(:mongo, collection_name, params)
        |> Enum.to_list()
        |> Enum.map(fn x ->
          Map.to_list(x)
          |> List.delete_at(0)
          |> Enum.into(%{})
        end)

      if check_empty != [] do
        check_empty
      else
        inserted_id =
          Mongo.insert_one!(:mongo, collection_name, params)
          |> Map.get(:inserted_id)

        Mongo.find(:mongo, collection_name, %{_id: inserted_id})
        |> Enum.to_list()
        |> Enum.map(fn x ->
          Map.to_list(x)
          |> List.delete_at(0)
          |> Enum.into(%{})
        end)
      end
    end
  end

  defp _method_put(params, dataset_id, user_id) do
    if dataset_id == nil or map_size(params) < 2 do
      raise Error, code: Error.c_NOT_FOUND(), reason: "dataset"
    else
      _exists_dataset!(dataset_id, user_id)

      %{collection_name: collection_name} = DatasetManager.get_dataset!(dataset_id, user_id)

      filter =
        [
          Map.to_list(params)
          |> List.first()
        ]
        |> Enum.into(%{})

      {:ok, result} =
        Mongo.find_one_and_update(
          :mongo,
          collection_name,
          filter,
          %{"$set": params},
          return_document: :after
        )

      if result == nil do
        raise Error, code: Error.c_NO_RESULT_FOUND(), reason: nil
      else
        result
        |> Map.to_list()
        |> List.delete_at(0)
        |> Enum.into(%{})
      end
    end
  end

  defp _method_delete(params, dataset_id, user_id) do
    if dataset_id == nil do
      raise Error, code: Error.c_NOT_FOUND(), reason: "dataset"
    else
      _exists_dataset!(dataset_id, user_id)

      %{collection_name: collection_name} = DatasetManager.get_dataset!(dataset_id, user_id)

      {:ok, result} =
        Mongo.find_one_and_delete(
          :mongo,
          collection_name,
          Map.take(params, [:id])
        )

      if result == nil do
        raise Error, code: Error.c_NO_RESULT_FOUND(), reason: nil
      else
        result
        |> Map.to_list()
        |> List.delete_at(0)
        |> Enum.into(%{})
      end
    end
  end

  defp _exists_dataset!(dataset_id, user_id) do
    unless is_nil(dataset_id) do
      unless DatasetManager.exists_dataset?(dataset_id, user_id) do
        raise Error, code: Error.c_NOT_FOUND(), reason: "dataset"
      end
    end
  end
end
