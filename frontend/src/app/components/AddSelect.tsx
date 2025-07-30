import AsyncSelect from "react-select/async";
import { MultiValue } from "react-select";

import { isDarkColor, adjustColor } from "@/app/util/colorUtil";
import { SelectOption } from "@/app/types/index";


interface AddSelectProps {
  debouncedFetch: (inputValue: string, callback: (options: SelectOption[]) => void) => void;
  handleSelectChange: (val: MultiValue<SelectOption>) => void;
  selectValue: SelectOption[];
  subject: string;
}

const AddSelect = ({ debouncedFetch, handleSelectChange, selectValue, subject }: AddSelectProps) => {
  return (
    <AsyncSelect
      defaultOptions={false}
      loadOptions={debouncedFetch}
      onChange={handleSelectChange}
      value={selectValue}
      isMulti
      cacheOptions
      placeholder={`+ Add existing ${subject}s...`}
      noOptionsMessage={() => `Enter a ${subject} name to add it`}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: 'var(--background)',
          marginTop: '1rem',
          cursor: 'pointer',
          padding: '0.2rem',
          textAlign: 'left',
          borderColor: 'var(--foreground)',
          ':hover': {
            borderColor: 'var(--accent)',
          }
        }),
        dropdownIndicator: () => ({
          display: 'none'
        }),
        indicatorSeparator: () => ({
          display: 'none'
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: 'var(--background)',
          marginTop: 0,
        }),
        option: (base, { data }) => ({
          ...base,
          marginBottom: '0.2rem',
          backgroundColor: data.color,
          color: isDarkColor(data.color) ? 'var(--background)' : 'var(--foreground)',
          ':hover': {
            backgroundColor: adjustColor(data.color, -40),
            cursor: 'pointer'
          }
        }),
        multiValue: (base, { data }) => ({
          ...base,
          backgroundColor: data.color,
          color: isDarkColor(data.color) ? 'var(--background)' : 'var(--foreground)',
        }),
        multiValueLabel: (base, { data }) => ({
          ...base,
          color: isDarkColor(data.color) ? 'var(--background)' : 'var(--foreground)',
        })
      }}
    />
  );
}
export default AddSelect;