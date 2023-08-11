defmodule MayerWeb.Router do
  use MayerWeb, :router
  use Plug.ErrorHandler

  alias Mayer.Error
  alias MayerWeb.ErrorView

  pipeline :api do
    plug(:accepts, ["json"])
  end

  pipeline :browser do
    plug :fetch_session
    plug :accepts, ["html"]
  end

  pipeline :ensure_auth do
    # plug(:accepts, ["json"])
    plug(Mayer.Auth.Pipeline)
    plug(Guardian.Plug.EnsureAuthenticated)
  end

  # if Mix.env() == :dev do
  #   scope "/dev" do
  #     # pipe_through [:browser]

  #     forward "/mailbox", Plug.Swoosh.MailboxPreview
  #   end
  # end

  scope "/api/v1", MayerWeb do
    ### unauthenticated
    pipe_through(:api)
    # sign in api
    post("/sign_in", SessionController, :sign_in)
    get("/auth/:provider", SessionController, :request)
    get("/auth/:provider/callback", SessionController, :callback)

    # sign up api
    post("/sign_up", SessionController, :sign_up)

    # forgot password api
    post("/forgot_password", SessionController, :forgot_password)
    post("/reset_password", SessionController, :reset_password)
    # execute api
    match(:*, "/execute_api/:api_key/:path", ExecuteApiController, :execute_api)

    ### authenticated
    pipe_through(:ensure_auth)

    # sign out api
    post("/sign_out", SessionController, :sign_out)

    # change password api
    put("/change_password/:id", SessionController, :change_password)

    # project api
    get("/projects", ProjectController, :get_project_list)
    get("/projects/:id", ProjectController, :get_project)
    post("/projects", ProjectController, :create_project)
    put("/projects/:id", ProjectController, :update_project)
    delete("/projects", ProjectController, :delete_project)

    # schema api
    get("/schemas", SchemaController, :get_schema_list)
    get("/schemas/:id", SchemaController, :get_schema)
    post("/schemas", SchemaController, :create_schema)
    put("/schemas/:id", SchemaController, :update_schema)
    delete("/schemas", SchemaController, :delete_schema)

    # field api
    get("/fields", FieldController, :get_field_list)
    get("/fields/:id", FieldController, :get_field)
    post("/fields", FieldController, :create_field)
    post("/many_fields", FieldController, :create_many_field)
    put("/fields/:id", FieldController, :update_field)
    delete("/fields", FieldController, :delete_field)

    # fake data api
    post("/preview_data", GenerateDataController, :preview_data)
    post("/bulk_mongodb", GenerateDataController, :bulk_mongodb)
    post("/check_bulk_mongodb", GenerateDataController, :check_bulk_mongodb)
    post("/write_file", GenerateDataController, :write_file)
    post("/download_file", GenerateDataController, :download_file)
    post("/remove_file", GenerateDataController, :remove_file)

    # dataset api
    get("/datasets", DatasetController, :get_dataset_list)
    get("/datasets/:id", DatasetController, :get_dataset)
    put("/datasets/:id", DatasetController, :update_dataset)
    delete("/datasets", DatasetController, :delete_dataset)

    # mock api api
    get("/mock_apis", ApiController, :get_api_list)
    get("/mock_apis/:id", ApiController, :get_api)
    post("/mock_apis", ApiController, :create_api)
    put("/mock_apis/:id", ApiController, :update_api)
    put("/mock_apis/:id/api_key", ApiController, :update_api_key)
    delete("/mock_apis", ApiController, :delete_api)
  end

  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: reason, stack: _stack}) do
    with {status, error} when not is_nil(error) <- Error.transform(reason) do
      conn
      |> put_status(status)
      |> put_view(ErrorView)
      |> render("error.json", error: error)
    else
      _ ->
        conn
        |> put_status(:internal_server_error)
        |> put_view(ErrorView)
        |> render("500.json")
    end
  end
end
