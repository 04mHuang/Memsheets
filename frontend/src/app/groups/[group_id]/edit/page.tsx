"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

import EditButtons from "@/app/components/EditButtons";
import GroupForm from "@/app/components/GroupForm";
import { isDarkColor } from "@/app/util/colorUtil";

interface Sheet {
  id: string;
  name: string;
  color: string;
}
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
  
  // Get current group settings to display in GroupForm
  useEffect(() => {
    if (!group_id) {
      return;
    }
    (async () => {
      try {
        const res = await axiosInstance.get(`/groups/${group_id}`);
        // Format sheets to be suitable for AsyncSelect
        const formattedSheets = res.data.sheets.map((sheet: Sheet) => ({
          value: sheet.id,
          label: sheet.name,
          color: sheet.color,
        }))
        setGroup({
          "name": res.data.name,
          "color": res.data.color,
          "sheets": formattedSheets
        });
      }
      catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = async () => {
    try {
      await axiosInstance.post(`/groups/edit/${group_id}`, group);
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