import { Input as BaseInput } from "@vayva/ui";

export const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: any) => (
  <BaseInput
    label=""
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
  />
);
