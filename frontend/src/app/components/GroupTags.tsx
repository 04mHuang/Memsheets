"use client";

import { useState } from "react";
import { BsFillPencilFill } from "react-icons/bs";

import { isDarkColor } from "@/app/util/colorUtil";
import { GSInterface } from "@/app/types/index";

interface GroupTagsProps {
  groupTags: GSInterface[];
  sheetColor: string;
  setGroupModalOpen: (isOpen: boolean) => void;
  isEditable?: boolean;
}

const GroupTags = ({ groupTags, sheetColor, setGroupModalOpen, isEditable }: GroupTagsProps) => {
  // Tooltip used when there are more than GROUP_TAGS_TOOLTIP_THRESHOLD group tags
  const GROUP_TAGS_TOOLTIP_THRESHOLD = 5;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-2 flex items-center">
      {/* Only show tags for first GROUP_TAGS_TOOLTIP_THRESHOLD groups */}
      {groupTags.slice(0, GROUP_TAGS_TOOLTIP_THRESHOLD).map((group) => (
        <span
          key={group.id}
          style={{ backgroundColor: group.color }}
          className={`border-2 border-solid mr-2 my-2 py-1 px-2 rounded-lg ${isDarkColor(group.color) ? 'text-background' : 'text-foreground'}`}
        >
          {group.name}
        </span>
      ))}
      {/* If there are more than GROUP_TAGS_TOOLTIP_THRESHOLD groups, condense rest into a tooltip */}
      {groupTags.length > GROUP_TAGS_TOOLTIP_THRESHOLD && (
        <span
          className={`relative text-sm mr-3 cursor-help ${isDarkColor(sheetColor) ? 'text-background' : 'text-foreground'}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          + {groupTags.length - GROUP_TAGS_TOOLTIP_THRESHOLD} more
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-foreground text-background text-xs rounded whitespace-nowrap z-10 before:content-[''] before:absolute before:top-full before:left-4 before:border-4 before:border-transparent before:border-t-foreground">
              {groupTags.slice(GROUP_TAGS_TOOLTIP_THRESHOLD).map(g => g.name).join(', ')}
            </div>
          )}
        </span>
      )}
      {isEditable &&
        <button type="button" onClick={() => setGroupModalOpen(true)} className="w-5 cursor-pointer">
          <BsFillPencilFill className="w-full h-full" />
        </button>
      }
    </div>
  );
}
export default GroupTags;