import { Input } from "~/components/ui/input";
import { FocusableInputProps } from "~/types/compound";

export function FocusableInput({
  field,
  isFocused,
  setIsFocused,
  formatter,
  parser,
}: FocusableInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsedValue = parser(rawValue);
    if (parsedValue !== "") {
      const numberValue = parseFloat(parsedValue);
      if (!isNaN(numberValue)) {
        field.onChange(numberValue);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  return (
    <Input
      {...field}
      type="text"
      inputMode="decimal"
      value={isFocused ? field.value : formatter(field.value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}
