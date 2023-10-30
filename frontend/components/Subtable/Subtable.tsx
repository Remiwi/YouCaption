"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./Subtable.module.css";

import DUMMY_DATA from "./DummyData";
import Filter from "../Filters/Filter";

type SubtableProps = {
  subtitles: {
    author: string;
    language: string;
    rating: number;
    download: string;
  }[];
};

const columns = [
  {
    accessorKey: "author",
    header: "Author",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "download",
    header: "Download",
    cell: (props: any) => <a href={props.getValue()}>⇓</a>,
  },
];

export default function Subtable(SubtableProps: SubtableProps) {
  const [data, setData] = useState(DUMMY_DATA);
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={styles.subtable}>
      <div className={styles.filters}>
        <Filter
          filterId="language"
          icon={"/icons/language.png"}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <Filter
          filterId="author"
          icon={"/icons/signature.png"}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </div>
      <table>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>{header.column.columnDef.header as any}</th>
            ))}
          </tr>
        ))}
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell as any,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
