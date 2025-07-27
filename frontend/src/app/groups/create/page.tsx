"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

import EditButtons from "@/app/components/EditButtons";
import GroupForm from "@/app/components/GroupForm";
import { isDarkColor } from "@/app/util/colorUtil";

interface SheetOption {
  value: string;
  label: string;
  color: string;
}

const CreateGroup = () => {
  const router = useRouter();
  // Basic information of group
  const [group, setGroup] = useState({
    "name": "",
    "color": "#999999",
    "sheets": [] as SheetOption[]
  });
  

  const handleCreate = async () => {
    try {
      const res = await axiosInstance.post("/groups/create", group);
      if (res.data.id) {
        router.push(`/groups/${res.data.id}`);
      }
    }
    catch (error) {
      console.error("Error creating group:", error);
    }
  }

  return (
    <div className="page-container">
      <EditButtons
        editMode={true}
        submit={handleCreate}
        exit={() => router.back()}
      />
      <div className={`sheet ${isDarkColor(group.color) ? "text-background" : "text-foreground"}`} style={{ background: group.color, '--placeholder-color': isDarkColor(group.color) ? "var(--background)" : "var(--foreground)" } as React.CSSProperties}>
        <form method="POST" onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
          <GroupForm group={group} setGroup={setGroup} />
        </form>
      </div>
    </div>
  );
}
export default CreateGroup;