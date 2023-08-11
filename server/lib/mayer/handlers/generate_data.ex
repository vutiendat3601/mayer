defmodule Mayer.Handlers.GenerateData do
  def type_animal_name(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Pokemon.name()}'")

  def type_avatar(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Avatar.image_url(64, 64)}'")

  def type_blank(column_name), do: Map.new("#{column_name}": "")

  def type_boolean(column_name),
    do: Map.new("#{column_name}": Faker.Util.pick([true, false]))

  def type_city(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Address.city()}'")

  def type_color(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Color.name()}'")

  def type_company_name(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Company.name()}'")

  def type_country(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Address.En.country()}'")

  def type_country_code(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Address.country_code()}'")

  def type_currency(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Currency.symbol()}'")

  def type_currency_code(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Currency.code()}'")

  def type_date_time(column_name, from, to),
    do:
      Map.new(
        "#{column_name}":
          Date.to_string(Faker.Date.between(Date.from_iso8601!(from), Date.from_iso8601!(to)))
      )

  def type_department(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Commerce.department()}'")

  def type_domain_name(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Internet.url()}'")

  def type_email_address(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Internet.email()}'")

  def type_file_name(column_name),
    do: Map.new("#{column_name}": "'#{Faker.File.file_name()}'")

  def type_first_name(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Name.first_name()}'")

  def type_full_name(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Name.name()}'")

  def type_gender(column_name),
    do: Map.new("#{column_name}": Faker.Util.pick(["'Male'", "'Female'"]))

  def type_job_title(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Name.title()}'")

  def type_last_name(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Name.last_name()}'")

  def type_money(column_name, min, max),
    do: Map.new("#{column_name}": Faker.random_between(min, max))

  def type_number(column_name, min, max),
    do: Map.new("#{column_name}": Faker.random_between(min, max))

  def type_paragraph(column_name, min, max),
    do: Map.new("#{column_name}": "'#{Faker.Lorem.paragraph(min..max)}'")

  def type_password(column_name),
    do: Map.new("#{column_name}": "'#{Faker.String.base64(15)}'")

  def type_phone(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Phone.PtBr.phone()}'")

  def type_plant_name(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Pizza.vegetable()}'")

  def type_product(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Commerce.product_name()}'")

  def type_row_number(column_name, index), do: Map.new("#{column_name}": index)

  def type_username(column_name),
    do: Map.new("#{column_name}": "'#{Faker.Internet.user_name()}'")

  def default, do: nil

  def generate_data(opts \\ %{}) do
    case Map.get(opts, :code_type) do
      "type_animal_name" ->
        type_animal_name(Map.get(opts, :name))

      "type_avatar" ->
        type_avatar(Map.get(opts, :name))

      "type_blank" ->
        type_blank(Map.get(opts, :name))

      "type_boolean" ->
        type_boolean(Map.get(opts, :name))

      "type_city" ->
        type_city(Map.get(opts, :name))

      "type_color" ->
        type_color(Map.get(opts, :name))

      "type_company_name" ->
        type_company_name(Map.get(opts, :name))

      "type_country" ->
        type_country(Map.get(opts, :name))

      "type_country_code" ->
        type_country_code(Map.get(opts, :name))

      "type_currency" ->
        type_currency(Map.get(opts, :name))

      "type_currency_code" ->
        type_currency_code(Map.get(opts, :name))

      "type_date_time" ->
        type_date_time(
          Map.get(opts, :name),
          Map.get(opts, :option_from),
          Map.get(opts, :option_to)
        )

      "type_department" ->
        type_department(Map.get(opts, :name))

      "type_domain_name" ->
        type_domain_name(Map.get(opts, :name))

      "type_email_address" ->
        type_email_address(Map.get(opts, :name))

      "type_file_name" ->
        type_file_name(Map.get(opts, :name))

      "type_first_name" ->
        type_first_name(Map.get(opts, :name))

      "type_full_name" ->
        type_full_name(Map.get(opts, :name))

      "type_gender" ->
        type_gender(Map.get(opts, :name))

      "type_job_title" ->
        type_job_title(Map.get(opts, :name))

      "type_last_name" ->
        type_last_name(Map.get(opts, :name))

      "type_money" ->
        type_money(
          Map.get(opts, :name),
          Map.get(opts, :option_min),
          Map.get(opts, :option_max)
        )

      "type_number" ->
        type_number(
          Map.get(opts, :name),
          Map.get(opts, :option_min),
          Map.get(opts, :option_max)
        )

      "type_paragraph" ->
        type_paragraph(
          Map.get(opts, :name),
          Map.get(opts, :option_min),
          Map.get(opts, :option_max)
        )

      "type_password" ->
        type_password(Map.get(opts, :name))

      "type_phone" ->
        type_phone(Map.get(opts, :name))

      "type_plant_name" ->
        type_plant_name(Map.get(opts, :name))

      "type_product" ->
        type_product(Map.get(opts, :name))

      "type_row_number" ->
        type_row_number(Map.get(opts, :name), Map.get(opts, :index))

      "type_username" ->
        type_username(Map.get(opts, :name))

      _ ->
        default()
    end
  end
end
