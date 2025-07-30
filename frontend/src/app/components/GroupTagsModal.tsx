import { BsX } from "react-icons/bs";

import ModalBase from "@/app/components/ModalBase";
import { isDarkColor } from "@/app/util/colorUtil";
import { GSInterface, CustomModalProps } from "@/app/types/index";

interface GroupTagsModalProps extends CustomModalProps {
  groupTags: GSInterface[];
}

const GroupTagsModal = ({ isOpen, onClose, groupTags }: GroupTagsModalProps) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Edit Groups List">
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
            title={`Remove sheet from ${group.name}`}
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