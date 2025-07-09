import { useRouter, usePathname } from "next/navigation";
import { isDarkColor } from "@/app/util/colorUtil";

interface CardInterface {
  id: number,
  name: string,
  color: string,
}

const Card = ({ item, type }: { item: CardInterface; type: string }) => {
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
      className={`card hover-animation ${isDarkColor(bgColor) ? 'text-background' : 'text-foreground'}`}
      style={{ backgroundColor: bgColor }}
    >
      <h1 className="card-name">{item.name}</h1>
    </div>
  );
}

export default Card;