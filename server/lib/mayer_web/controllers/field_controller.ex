defmodule MayerWeb.FieldController do
  use MayerWeb, :controller

  alias Mayer.{
    Managers.FieldManager,
    Managers.SchemaManager,
    Validator,
    Error,
    Schemas.Field
  }

  alias MayerWeb.{
    FieldView
  }

  @api_inject :get_field_list
  @api_param_field %{
    schema_id: [
      type: :integer,
      required: true
    ]
  }
  def get_field_list(conn, params, %{user_id: user_id}) do
    %{schema_id: schema_id} =
      @api_param_field
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    _exists_schema!(user_id, schema_id)

    list = FieldManager.get_field_list(schema_id)

    conn
    |> put_view(FieldView)
    |> render("field_list.json", list: list)
  end

  @api_inject :get_field
  @api_param_field %{
    id: [
      type: :integer,
      required: true
    ],
    schema_id: [
      type: :integer,
      required: true
    ]
  }
  def get_field(conn, params, %{user_id: user_id}) do
    %{id: field_id, schema_id: schema_id} =
      @api_param_field
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    _exists_schema!(user_id, schema_id)

    field = FieldManager.get_field!(schema_id, field_id)

    conn
    |> put_view(FieldView)
    |> render("show_field.json", field: field)
  end

  @api_inject :create_field
  @api_param_field %{
    schema_id: [
      type: :integer,
      required: true
    ],
    name: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/,
      required: true
    ],
    null_percentage: [
      type: :integer,
      inclusion: 0..100,
      required: true
    ],
    formula: [
      type: :string
    ],
    code_type: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-zA-Z0-9 _]+$/,
      required: true
    ],
    option_from: [
      type: :string,
      format: ~r/^\S*$/
    ],
    option_to: [
      type: :string,
      format: ~r/^\S*$/
    ],
    option_min: [
      type: :integer
    ],
    option_max: [
      type: :integer
    ],
    option_format: [
      type: :string,
      format: ~r/^\S*$/
    ],
    option_decimals: [
      type: :integer,
      inclusion: 0..10
    ],
    option_schema_name: [
      type: :string,
      format: ~r/^\S(?!.*_\d)[a-zA-Z0-9 _]+$/
    ],
    option_field_name: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/
    ],
    option_custom: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-zA-Z0-9 _]+$/
    ]
  }
  def create_field(conn, params, %{user_id: user_id}) do
    params =
      @api_param_field
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    _exists_schema!(user_id, Map.get(params, :schema_id))

    new_field =
      FieldManager.upsert_field!(
        %Field{},
        Map.take(params, [
          :schema_id,
          :name,
          :null_percentage,
          :formula,
          :code_type,
          :option_from,
          :option_to,
          :option_min,
          :option_max,
          :option_format,
          :option_decimals,
          :option_schema_name,
          :option_field_name,
          :option_custom
        ])
      )

    conn
    |> put_view(FieldView)
    |> render("show_field.json", field: new_field)
  end

  @api_inject :create_many_field
  @api_param_many_field %{
    schema_id: [
      type: :integer,
      required: true
    ],
    fields: [
      type: {
        :array,
        %{
          name: [
            type: :string,
            format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/,
            required: true
          ],
          null_percentage: [
            type: :integer,
            inclusion: 0..100,
            required: true
          ],
          formula: [
            type: :string
          ],
          code_type: [
            type: :string,
            format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-zA-Z0-9 _]+$/,
            required: true
          ],
          option_from: [
            type: :string,
            format: ~r/^\S*$/
          ],
          option_to: [
            type: :string,
            format: ~r/^\S*$/
          ],
          option_min: [
            type: :integer
          ],
          option_max: [
            type: :integer
          ],
          option_format: [
            type: :string,
            format: ~r/^\S*$/
          ],
          option_decimals: [
            type: :integer,
            inclusion: 0..10
          ],
          option_schema_name: [
            type: :string,
            format: ~r/^\S(?!.*_\d)[a-zA-Z0-9 _]+$/
          ],
          option_field_name: [
            type: :string,
            format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/
          ],
          option_custom: [
            type: :string,
            format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-zA-Z0-9 _]+$/
          ]
        }
      }
    ]
  }
  def create_many_field(conn, params, %{user_id: user_id}) do
    params =
      @api_param_many_field
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    _exists_schema!(user_id, Map.get(params, :schema_id))

    fields =
      Enum.map(Map.get(params, :fields), fn field ->
        FieldManager.upsert_field!(
          %Field{},
          Map.merge(
            %{schema_id: Map.get(params, :schema_id)},
            Map.take(field, [
              :name,
              :null_percentage,
              :formula,
              :code_type,
              :option_from,
              :option_to,
              :option_min,
              :option_max,
              :option_format,
              :option_decimals,
              :option_schema_name,
              :option_field_name,
              :option_custom
            ])
          )
        )
      end)

    conn
    |> put_view(FieldView)
    |> render("insert_many_fields.json", fields: fields)
  end

  @api_inject :update_field
  @api_param_field %{
    id: [
      type: :integer,
      required: true
    ],
    schema_id: [
      type: :integer,
      required: true
    ],
    name: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/,
      required: true
    ],
    null_percentage: [
      type: :integer,
      inclusion: 0..100,
      required: true
    ],
    formula: [
      type: :string
    ],
    code_type: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-zA-Z0-9 _]+$/,
      required: true
    ],
    option_from: [
      type: :string,
      format: ~r/^\S*$/
    ],
    option_to: [
      type: :string,
      format: ~r/^\S*$/
    ],
    option_min: [
      type: :integer
    ],
    option_max: [
      type: :integer
    ],
    option_format: [
      type: :string,
      format: ~r/^\S*$/
    ],
    option_decimals: [
      type: :integer,
      inclusion: 0..10
    ],
    option_schema_name: [
      type: :string,
      format: ~r/^\S(?!.*_\d)[a-zA-Z0-9 _]+$/
    ],
    option_field_name: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-z0-9_]+$/
    ],
    option_custom: [
      type: :string,
      format: ~r/^\S(?![0-9._])(?!.*[0-9._]$)(?!.*\d_)(?!.*_\d)[a-zA-Z0-9 _]+$/
    ]
  }
  def update_field(conn, params, %{user_id: user_id}) do
    params =
      @api_param_field
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    _exists_schema!(user_id, Map.get(params, :schema_id))

    field = FieldManager.get_field!(Map.get(params, :schema_id), Map.get(params, :id))

    new_field =
      FieldManager.upsert_field!(
        field,
        Map.take(params, [
          :name,
          :null_percentage,
          :formula,
          :code_type,
          :option_from,
          :option_to,
          :option_min,
          :option_max,
          :option_format,
          :option_decimals,
          :option_schema_name,
          :option_field_name,
          :option_custom
        ])
      )

    conn
    |> put_view(FieldView)
    |> render("show_field.json", field: new_field)
  end

  @api_inject :delete_field
  @api_param_field %{
    ids: [
      type: {:array, :integer},
      required: true
    ],
    schema_id: [
      type: :integer,
      required: true
    ]
  }
  def delete_field(conn, params, %{user_id: user_id}) do
    %{ids: ids, schema_id: schema_id} =
      @api_param_field
      |> Validator.parse(params)
      |> Validator.get_validated_changes!()

    _exists_schema!(user_id, schema_id)

    for id <- ids do
      if FieldManager.exists_field?(id, schema_id) == false do
        raise Error, code: Error.c_NOT_FOUND(), reason: "field_id"
      end
    end

    {number_record, _} = FieldManager.delete_fields!(schema_id, ids)

    if number_record == length(ids) do
      conn
      |> put_view(FieldView)
      |> render("delete_field.json")
    else
      raise Error, code: Error.c_INTERNAL_SERVER_ERROR(), reason: nil
    end
  end

  defp _exists_schema!(user_id, schema_id) do
    unless SchemaManager.exists_schema?(user_id, schema_id) do
      raise Error, code: Error.c_NOT_FOUND(), reason: "schema_id"
    end
  end
end
