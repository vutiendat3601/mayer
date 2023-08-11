defmodule Mayer.Repo.Migrations.CreateApi do
  use Ecto.Migration

  def change do
    create table(:apis) do
      add(:name, :string)
      add(:method, :integer)
      add(:path, :string)
      add(:api_key, :string)
      add(:user_id, references(:users, on_delete: :delete_all))
      add(:dataset_id, references(:datasets, on_delete: :delete_all))
      add(:schema_id, references(:schemas, on_delete: :nilify_all))
      add(:project_id, references(:projects, on_delete: :nilify_all))

      timestamps()
    end

    create(index(:apis, [:user_id]))
    create(index(:apis, [:schema_id]))
  end
end
