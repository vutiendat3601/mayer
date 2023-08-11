defmodule Mayer.Repo.Migrations.CreateSchema do
  use Ecto.Migration

  def change do
    create table(:schemas) do
      add(:name, :string)
      add(:user_id, references(:users, on_delete: :delete_all))
      add(:project_id, references(:projects, on_delete: :nilify_all))

      timestamps()
    end

    create(index(:schemas, [:user_id]))
    create(index(:schemas, [:project_id]))
  end
end
