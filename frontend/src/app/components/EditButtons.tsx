import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

interface EditButtonsProps {
  editMode: boolean;
  submit?: () => void;
  exit: () => void;
};

const EditButtons = ({ editMode, submit, exit }: EditButtonsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={submit}
        className="bg-support h-10 w-10 rounded-4xl p-2 text-foreground hover:cursor-pointer hover:bg-dark-support hover:text-background"
      >
        {editMode ? <FaCheck className="w-full h-full" /> : <MdEdit className="w-full h-full" />}
      </button>
      <button
        onClick={(e) => { e.preventDefault(); exit(); }}
        className="border-2 border-accent h-10 w-10 rounded-4xl p-2 text-foreground hover:cursor-pointer hover:bg-accent hover:text-background"
      >
        {editMode ? <FaXmark className="w-full h-full" /> : <MdDelete className="w-full h-full" />}
      </button>
    </div>
  );
}
export default EditButtons;