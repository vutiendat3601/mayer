defmodule MayerWeb.ApiController do
  use MayerWeb, :controller

  alias Mayer.{
    Validator,
    Managers.ApiManager,
    Managers.ParamManager,
    Schemas.Api,
    Error
  }

  alias MayerWeb.{
    ApiView
  }

  @api_inject :get_api_list
  @api_paramn_pagination %{
    page: [
      type: :integer
    ],
    page_size: [
      type: :integer
    ],
    search: [
      type: :string
    ],
    project_id: [
      type: :integer
    ]
  }
  def get_api_list(conn, params, %{user_id: user_id}) do
    params =
      @api_paramn_pagination
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:page, :page_size, :search, :project_id])
      |> Map.to_list()

    list = ApiManager.get_api_list(user_id, params)

    conn
    |> put_view(ApiView)
    |> render("api_list.json", list: list)
  end

  @api_inject :get_api
  @api_param_get_api %{
    id: [
      type: :integer,
      required: true
    ]
  }
  def get_api(conn, params, %{user_id: user_id}) do
    %{id: id} =
      @api_param_get_api
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    api =
      ApiManager.get_api!(
        user_id,
        id
      )

    result = ApiManager.preload_api(api)

    conn
    |> put_view(ApiView)
    |> render("show_api.json", api: result)
  end

  @api_inject :create_api
  @api_param_create_api %{
    name: [
      type: :string,
      format: ~r/^\S(?!.*_\d)[a-zA-Z0-9 _]+$/,
      required: true
    ],
    method: [
      type: :integer,
      inclusion: 1..4,
      required: true
    ],
    path: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*\d_)(?!.*_\d)[a-zA-Z0-9_]+$/,
      required: true
    ],
    dataset_id: [
      type: :integer,
      required: false
    ],
    schema_id: [
      type: :integer,
      required: false
    ],
    project_id: [
      type: :integer,
      required: false
    ]
  }
  @api_param_create_param %{
    params: [
      type: {
        :array,
        %{
          key: [
            type: :string,
            format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/,
            required: true
          ],
          type: [
            type: :string,
            format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/,
            required: true
          ]
        }
      },
      required: true
    ]
  }
  def create_api(conn, params, %{user_id: user_id}) do
    params_api =
      @api_param_create_api
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:name, :method, :path, :dataset_id, :schema_id, :project_id])

    params_params =
      @api_param_create_param
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    new_api =
      ApiManager.upsert_api!(
        %Api{},
        Map.merge(params_api, %{user_id: user_id, api_key: Ecto.UUID.generate()})
      )

    ParamManager.create_param!(new_api, Map.get(params_params, :params))

    result = ApiManager.preload_api(new_api)

    conn |> put_view(ApiView) |> render("show_api.json", api: result)
  end

  @api_inject :update_api_key
  @api_param_update_api_key %{
    id: [
      type: :integer,
      required: true
    ]
  }
  def update_api_key(conn, params, %{user_id: user_id}) do
    %{id: api_id} =
      @api_param_update_api_key
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    api = ApiManager.get_api!(user_id, api_id)

    api_and_params = ApiManager.preload_api(api)

    new_api = ApiManager.update_api_key!(api_and_params, %{api_key: Ecto.UUID.generate()})

    conn
    |> put_view(ApiView)
    |> render("show_api.json", api: new_api)
  end

  @api_inject :update_api
  @api_param_update_api %{
    id: [
      type: :integer,
      required: true
    ],
    name: [
      type: :string,
      format: ~r/^\S(?!.*_\d)[a-zA-Z0-9 _]+$/
    ],
    method: [
      type: :integer,
      inclusion: 1..4
    ],
    path: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*\d_)(?!.*_\d)[a-zA-Z0-9_]+$/
    ],
    project_id: [
      type: :integer
    ]
  }
  @api_param_update_param %{
    params: [
      type: {
        :array,
        %{
          key: [
            type: :string,
            format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/,
            required: true
          ],
          type: [
            type: :string,
            format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/,
            required: true
          ]
        }
      }
    ]
  }
  def update_api(conn, params, %{user_id: user_id}) do
    params_api =
      @api_param_update_api
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> Map.take([:id, :name, :method, :path, :path, :project_id])

    params_params =
      @api_param_update_param
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()
      |> IO.inspect(label: "params")

    api = ApiManager.get_api!(user_id, Map.get(params_api, :id))

    new_api = ApiManager.upsert_api!(api, params_api)

    # them api update params

    result = ApiManager.preload_api(new_api)

    conn
    |> put_view(ApiView)
    |> render("show_api.json", api: result)
  end

  @api_inject :delete_api
  @api_param_delete_api %{
    ids: [
      type: {:array, :integer},
      required: true
    ]
  }
  def delete_api(conn, params, %{user_id: user_id}) do
    %{ids: ids} =
      @api_param_delete_api
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    for id <- ids do
      if ApiManager.exists_api?(user_id, id) == false do
        raise Error, code: Error.c_NOT_FOUND(), reason: "api_id"
      end
    end

    {number_record, _} = ApiManager.delete_api(user_id, ids)

    if number_record == length(ids) do
      conn
      |> put_view(ApiView)
      |> render("delete_api.json")
    else
      raise Error, code: Error.c_INTERNAL_SERVER_ERROR(), reason: nil
    end
  end
end
