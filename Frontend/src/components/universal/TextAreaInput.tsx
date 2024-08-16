import { twMerge } from "tailwind-merge";

const TextAreaInput = ({
  name,
  placeholder,
  value,
  onChange,
  rows,
  errorMsg,
  className,
  clearErrorMsg,
}: {
  name: string;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  errorMsg?: string;
  clearErrorMsg: () => void;
}) => {
  return (
    <div className="flex w-full flex-col">
      <textarea
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => clearErrorMsg()}
        className={twMerge(
          "rounded-md border-[1px] border-slate-500 px-2 py-1 focus:outline-blue-300",
          className,
          errorMsg && "border-red-500 bg-red-50",
        )}
        rows={rows}
        value={value}
      ></textarea>
      {errorMsg && <p className="px-2 text-sm text-red-500">{errorMsg}!</p>}
    </div>
  );
};

export default TextAreaInput;
