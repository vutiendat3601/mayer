defmodule Mayer.Repo.Migrations.CreateDataset do
  use Ecto.Migration

  def change do
    create table(:datasets) do
      add(:name, :string)
      add(:collection_name, :string)
      add(:schema_id, references(:schemas, on_delete: :nilify_all))
      add(:project_id, references(:projects, on_delete: :nilify_all))
      add(:user_id, references(:users, on_delete: :delete_all))

      timestamps()
    end

    create(index(:datasets, [:schema_id]))
    create(index(:datasets, [:user_id]))
  end
end
