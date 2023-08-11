defmodule Mayer.Utils.Constants do
  def c_EMAIL_FORMAT, do: ~r/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/
  def c_PASSWORD_FORMAT, do: ~r/(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,.\/?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/
end
