import { useRouter, usePathname } from "next/navigation";

interface CardInterface {
  id: number,
  name: string,
  color: string,
}

const Card = ({ item, type }: { item: CardInterface; type: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const id = item.id;
  const color = item.color;

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
      style={{ backgroundColor: color }}
    >
      <h1 className="card-name">{item.name}</h1>
    </div>
  );
}

export default Card;