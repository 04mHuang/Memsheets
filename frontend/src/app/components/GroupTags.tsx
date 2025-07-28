"use client";

import { useState } from "react";
import { isDarkColor } from "../util/colorUtil";

interface GroupTagType {
  id: number,
  name: string,
  color: string
}

interface GroupTagsProps {
  groupTags: GroupTagType[];
  sheetColor: string;
}

const GroupTags = ({ groupTags, sheetColor }: GroupTagsProps) => {
  // Tooltip used when there are more than 3 group tags
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-4">
      {/* Only show tags for first 3 groups */}
      {groupTags.slice(0, 3).map((group) => (
        <span
          key={group.id}
          style={{ backgroundColor: group.color }}
          className={`mr-2 py-1 px-2 rounded-lg ${isDarkColor(group.color) ? 'text-background' : 'text-foreground'}`}
        >
          {group.name}
        </span>
      ))}
      {/* If there are more than 3 groups, condense rest into a tooltip */}
      {groupTags.length > 3 && (
        <span
          className={`relative text-sm cursor-help ${isDarkColor(sheetColor) ? 'text-background' : 'text-foreground'}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          + {groupTags.length - 3} more
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-foreground text-background text-xs rounded whitespace-nowrap z-10 before:content-[''] before:absolute before:top-full before:left-4 before:border-4 before:border-transparent before:border-t-foreground">
              {groupTags.slice(3).map(g => g.name).join(', ')}
            </div>
          )}
        </span>
      )}
    </div>
  );
}
export default GroupTags;