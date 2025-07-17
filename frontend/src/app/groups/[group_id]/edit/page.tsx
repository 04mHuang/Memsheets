"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

import EditButtons from "@/app/components/EditButtons";
import GroupForm from "@/app/components/GroupForm";
import { isDarkColor } from "@/app/util/colorUtil";

interface SheetOption {
  value: string;
  label: string;
  color: string;
}

const EditGroup = () => {
  const router = useRouter();
  const params = useParams<{ group_id: string; }>();
  const { group_id } = params;
  // Basic information of group
  const [group, setGroup] = useState({
    "name": "",
    "color": "#999999",
    "sheets": [] as SheetOption[]
  });
  

  const handleEdit = async () => {
    try {
      await axiosInstance.post(`/edit-group/${group_id}`, group);
      router.back();
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="page-container">
      <EditButtons
        editMode={true}
        submit={handleEdit}
        cancel={() => router.back()}
      />
      <div className={`sheet ${isDarkColor(group.color) ? "text-background" : "text-foreground"}`} style={{ background: group.color, '--placeholder-color': isDarkColor(group.color) ? "var(--background)" : "var(--foreground)" } as React.CSSProperties}>
        <form method="POST" onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
          <GroupForm group={group} setGroup={setGroup} />
        </form>
      </div>
    </div>
  );
}
export default EditGroup;