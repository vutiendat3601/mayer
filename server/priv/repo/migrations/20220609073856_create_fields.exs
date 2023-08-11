defmodule Mayer.Repo.Migrations.CreateField do
  use Ecto.Migration

  def change do
    create table(:fields) do
      add(:schema_id, references(:schemas, on_delete: :delete_all))
      add(:name, :string)
      add(:null_percentage, :integer)
      add(:formula, :text)
      add(:code_type, :string)
      add(:option_from, :string)
      add(:option_to, :string)
      add(:option_min, :integer)
      add(:option_max, :integer)
      add(:option_format, :string)
      add(:option_decimals, :integer)
      add(:option_schema_name, :string)
      add(:option_field_name, :string)
      add(:option_custom, :string)

      timestamps()
    end

    create(index(:fields, [:schema_id]))
  end
end
