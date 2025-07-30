"use client";

import { useState, useMemo, useEffect } from "react";

import { MultiValue } from "react-select";
import debounce from "lodash.debounce";

import axiosInstance from "@/app/axiosInstance";
import AddSelect from "@/app/components/AddSelect";
import { GSInterface, SelectOption } from "@/app/types/index";

interface GroupData {
  name: string;
  color: string;
  sheets: SelectOption[];
}
interface GroupFormProps {
  group: GroupData;
  setGroup: (group: GroupData) => void;
}

const GroupForm = ({ group, setGroup }: GroupFormProps) => {
  const [mounted, setMounted] = useState(false);

  // Fetch sheets with names matching the the user's input string
  const fetchSheets = async (input: string) => {
    try {
      const res = await axiosInstance.get(`/groups/search/sheets?q=${encodeURIComponent(input)}`);
      // Return the data in the correct format for AsyncSelect
      return res.data.results.map((sheet: GSInterface) => ({
        value: sheet.id,
        label: sheet.name,
        color: sheet.color
      }))
    }
    catch (error) {
      console.error(error);
    }
  };

  // Wait at least 300ms after last user event to fetch sheets
  const debouncedFetch = useMemo(() =>
    debounce((input, callback) => {
      fetchSheets(input).then(callback);
    }, 300), []
  );

  // Prevent hydration error; must be used after useMemo to prevent conditional rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  // Handles the sheets added to the group
  const handleSelectChange = (val: MultiValue<SelectOption>) => {
    setGroup({ ...group, sheets: Array.from(val) });
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroup({ ...group, [name]: value });
  };
  return (
    <>
      <input
        type="text"
        name="name"
        onChange={handleChange}
        value={group.name}
        placeholder="Group name"
        aria-label="Group name"
        className="sheet-input sheet-name"
        style={{ color: 'var(--placeholder-color)' }}
      />
      <br />
      <label className="sheet-input color-input">
        Group color
        <input
          type="color"
          name="color"
          onChange={handleChange}
          value={group.color}
        />
      </label>
      <AddSelect debouncedFetch={debouncedFetch} handleSelectChange={handleSelectChange} selectValue={group.sheets} />
    </>
  );
}
export default GroupForm;