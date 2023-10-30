"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./Subtable.module.css";

import DUMMY_DATA from "./DummyData";

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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.subtable}>
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
