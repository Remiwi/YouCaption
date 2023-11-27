import styles from "./Filter.module.css";
import Image from "next/image";

type FilterProps = {
  filterId: string;
  icon: any;
  columnFilters: any[];
  setColumnFilters: any;
};

export default function Filter({
  filterId,
  icon,
  columnFilters,
  setColumnFilters,
}: FilterProps) {
  const value = columnFilters.find((f) => f.id === filterId)?.value || "";

  const onFilterChange = (id: any, value: any) =>
    setColumnFilters((prev: any) =>
      prev.filter((f: any) => f.id !== id).concat({ id, value })
    );

  return (
    <div className={styles.filter}>
      <Image
        src={icon}
        alt={"Filter icon for " + filterId}
        width={25}
        height={25}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onFilterChange(filterId, e.target.value);
        }}
        placeholder={"Filter by " + filterId}
      />
    </div>
  );
}
