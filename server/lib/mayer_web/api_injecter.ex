defmodule MayerWeb.APIInjecter do
  defmacro __using__(_) do
    quote location: :keep do
      Module.register_attribute(__MODULE__, :api_inject, accumulate: true)

      @before_compile unquote(__MODULE__)

      def action(conn, opts) do
        _action_injecter(conn, opts)
      end
    end
  end

  defmacro __before_compile__(env) do
    # check module attribute @api_inject is valid type {func_name: atom()}
    api_inject_attrs = Module.get_attribute(env.module, :api_inject)

    for func_name <- api_inject_attrs do
      unless is_atom(func_name) do
        raise "@api_inject #{inspect(func_name)} is invalid type atom()"
      end

      unless Module.defines?(env.module, {func_name, 3}) do
        raise "function #{inspect(env.module)}.#{Atom.to_string(func_name)}/3 is undefined or private"
      end
    end

    quote location: :keep do
      defp _action_injecter(conn, opts) do
        _action_name = action_name(conn)

        args =
          if Enum.member?(@api_inject, _action_name) do
            [conn, conn.params, %{user_id: Mayer.Utils.Utilities.get_user_id(conn)}]
          else
            [conn, conn.params]
          end

        apply(__MODULE__, _action_name, args)
      end
    end
  end
end
