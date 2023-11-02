"use client";

import { useState } from "react";
import Image from "next/image";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./Subtable.module.css";

import DUMMY_DATA from "./DummyData";
import Filter from "../Filters/Filter";
import { get } from "http";

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
    enableSorting: false,
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
    getSortedRowModel: getSortedRowModel(),
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
              <th key={header.id}>
                <div>
                  {header.column.getCanSort() && (
                    <Image
                      src="/icons/sort.png"
                      alt="Sort icon"
                      width={100}
                      height={100}
                      onClick={header.column.getToggleSortingHandler()}
                    />
                  )}
                  {header.column.columnDef.header as any}
                  {
                    {
                      asc: (
                        <Image
                          src="/icons/arrowDown.png"
                          alt="arrowDown"
                          width={100}
                          height={100}
                        />
                      ),
                      desc: (
                        <Image
                          src="/icons/arrowUp.png"
                          alt="arrowUp"
                          width={100}
                          height={100}
                        />
                      ),
                      none: <></>,
                    }[header.column.getIsSorted() || "none"]
                  }
                </div>
              </th>
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
