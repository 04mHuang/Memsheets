"use client";

import { useState, useMemo, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { MultiValue } from "react-select";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import debounce from "lodash.debounce";

import EditButtons from "@/app/components/EditButtons";
import { isDarkColor, adjustColor } from "@/app/util/colorUtil";

interface SheetOption {
  value: string;
  label: string;
  color: string;
}
interface Sheet {
  id: string;
  name: string;
  color: string;
}

const EditGroup = () => {
  const router = useRouter();
  // Basic information of group
  const [group, setGroup] = useState({
    "name": "",
    "color": "#999999",
    "sheets": [] as SheetOption[]
  });
  const [mounted, setMounted] = useState(false);

  // Fetch sheets with names matching the the user's input string
  const fetchSheets = async (input: string) => {
    try {
      const res = await axiosInstance.get(`/search/groups/sheets?q=${encodeURIComponent(input)}`);
      // Return the data in the correct format for AsyncSelect
      return res.data.results.map((sheet: Sheet) => ({
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
  const handleSelectChange = (val: MultiValue<SheetOption>) => {
    setGroup({ ...group, sheets: Array.from(val) });
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroup({ ...group, [name]: value });
  };

  const createGroup = async () => {
    try {
      await axiosInstance.post("/new-group", group);
      router.push("/groups");
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="page-container">
      <EditButtons
        editMode={true}
        submit={createGroup}
        cancel={() => router.back()}
      />
      <div className={`sheet ${isDarkColor(group.color) ? "text-background" : "text-foreground"}`} style={{ background: group.color, '--placeholder-color': isDarkColor(group.color) ? "var(--background)" : "var(--foreground)" } as React.CSSProperties}>
        <form method="POST" onSubmit={(e) => { e.preventDefault(); createGroup(); }}>
          <input
            type="text"
            name="name"
            onChange={handleChange}
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
          <AsyncSelect
            defaultOptions={false}
            loadOptions={debouncedFetch}
            onChange={handleSelectChange}
            value={group.sheets}
            isMulti
            cacheOptions
            placeholder="+ Add existing sheets..."
            noOptionsMessage={() => "Enter a sheet name to add it"}
            styles ={{
              control: (base) => ({
                ...base,
                backgroundColor: 'var(--background)',
                padding: '0.25rem',
                marginTop: '1rem',
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
        </form>
      </div>
    </div>
  );
}
export default EditGroup;