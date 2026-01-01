import { useRouter, usePathname } from "next/navigation";
import { isDarkColor } from "@/app/util/colorUtil";
import { FaBook } from "react-icons/fa";
import { FaSheetPlastic } from "react-icons/fa6";
import { GSInterface } from "@/app/types/index";

const Card = ({ item, type }: { item: GSInterface; type: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const id = item.id;
  const bgColor = item.color;


  const handleClick = () => {
    if (type === "groups") {
      // Route to e.g. groups/1
      router.push(`/${type}/${id}`);
    }
    else if (pathname.includes("groups")) {
      // Route to e.g. groups/1/sheets/1
      router.push(`${pathname}/${type}/${id}`);
    }
  }
  return (
    <div
      onClick={handleClick}
      className="card hover-animation"
    >
      <div
        className="card-icon"
        style={{ backgroundColor: bgColor }}
      >
        {type === "groups" ? (
          <FaBook color={isDarkColor(bgColor) ? '#F5EDE3' : '#3A2D1E'} size={30} />
        ) : (
          <FaSheetPlastic color={isDarkColor(bgColor) ? '#F5EDE3' : '#3A2D1E'} size={30} />
        )}
      </div>
      <h2 className="card-name">{item.name}</h2>
    </div>
  );
}

export default Card;