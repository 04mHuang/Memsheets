"use client";

import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { MultiValue } from "react-select";
import { BsX } from "react-icons/bs";

import ModalBase from "@/app/components/ModalBase";
import AddSelect from "@/app/components/AddSelect";
import axiosInstance from "@/app/axiosInstance";
import { isDarkColor } from "@/app/util/colorUtil";
import { GSInterface, CustomModalProps, SelectOption } from "@/app/types/index";

interface GroupTagsModalProps extends CustomModalProps {
  groupTags: GSInterface[];
  setGroupTags: (groups: GSInterface[]) => void;
}

const GroupTagsModal = ({ isOpen, onClose, groupTags, setGroupTags }: GroupTagsModalProps) => {
  const [mounted, setMounted] = useState(false);

  // Fetch groups with names matching the the user's input string
  const fetchGroups = async (input: string) => {
    try {
      const res = await axiosInstance.get(`/groups/search?q=${encodeURIComponent(input)}`);
      // Return the data in the correct format for AddSelect
      return res.data.results.map((group: GSInterface) => ({
        value: group.id,
        label: group.name,
        color: group.color
      }));
    }
    catch (error) {
      console.error(error);
    }
  };

  // Wait at least 300ms after last user event to fetch sheets
  const debouncedFetch = useMemo(() =>
    debounce((input, callback) => {
      fetchGroups(input).then(callback);
    }, 300), []
  );

  // Prevent hydration error; must be used after useMemo to prevent conditional rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  // Handles the groups added to the sheet
  const handleSelectChange = (val: MultiValue<SelectOption>) => {
    // Prevent duplicate added groups
    const isAlreadyAdded = groupTags.some(group => group.id === parseInt(val[0].value));
    if (isAlreadyAdded) return;
    
    // Format the selected group's values
    // i.e. {value, label, color} to {id, name, color}
    const selectedGroup = Array.from(val).map(option => ({
      id: parseInt(option.value),
      name: option.label,
      color: option.color
    }));
    // Retain current group tags and add new group
    setGroupTags([...selectedGroup, ...groupTags]);
  }
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Edit Groups List">
      {/* To not display current groups, leave selectValue as an empty array */}
      <AddSelect debouncedFetch={debouncedFetch} handleSelectChange={handleSelectChange} selectValue={[]} subject="group" />
      <section className="max-h-120 mt-4 text-left overflow-auto">
        {groupTags.map((group) => (
          <div
            key={group.id}
            style={{ backgroundColor: group.color }}
            className={`flex justify-between p-2 mb-2 rounded-sm ${isDarkColor(group.color) ? 'text-background' : 'text-foreground'}`}
          >
            {group.name}
            <button
              className="w-7 cursor-pointer hover:bg-white/25 rounded-full"
              title={`Remove from ${group.name}`}
            >
              <BsX className="w-full h-full" />
            </button>
          </div>
        ))}
      </section>
    </ModalBase>
  );
}
export default GroupTagsModal;