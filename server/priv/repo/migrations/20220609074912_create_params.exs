defmodule Mayer.Repo.Migrations.CreateParam do
  use Ecto.Migration

  def change do
    create table(:params) do
      add(:key, :string)
      add(:type, :string)
      add(:api_id, references(:apis, on_delete: :delete_all))

      timestamps()
    end

    create(index(:params, [:api_id]))
  end
end
