defmodule Mayer.Managers.ParamManager do
  import Ecto.Query, warn: false

  alias Mayer.{
    Repo
  }

  def create_param!(api, params) do
    Enum.map(params, fn x ->
      build_assoc = Ecto.build_assoc(api, :params, x)

      Repo.insert!(build_assoc)
    end)
  end
end
