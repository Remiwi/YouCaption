"use client";

import React from "react";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./SubscriptionTable.module.css";

import Filter from "../Filters/Filter";

type SubscriptionTableProps = {
  videos: {
    videoID: string;
  }[];
};

export default function SubscriptionTable({ videos }: SubscriptionTableProps) {
  const [pageNumber, setPageNumber] = useState("1");
  const [data, setData] = useState(videos);
  const columns = useMemo(
    () => [
      {
        accessorKey: "videoID",
        header: "Video ID",
        cell: (props: any) => (
          <p>
            {
              <Link href={"/video?v=" + props.getValue()}>
                {props.getValue()}
              </Link>
            }
          </p>
        ),
      },
      {
        accessorKey: "videoID",
        header: "Unsubscribe",
        cell: (props: any) => (
          <div
            className={styles.unfollowIcon}
            onClick={() => {
              setData(
                data.filter((video) => video.videoID !== props.getValue())
              );
            }}
          >
            <Image
              src={"/icons/close.png"}
              alt="Close icon"
              width={100}
              height={100}
            />
          </div>
        ),
        enableSorting: false,
      },
    ],
    [data]
  );

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
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setData(videos);
  }, [videos]);

  return (
    <div className={styles.subtable}>
      <div className={styles.filters}>
        <Filter
          filterId="videoID"
          icon={"/icons/video.png"}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </div>
      <table>
        <tbody>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className={styles[header.id]} key={header.id}>
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
        </tbody>
      </table>
      <div className={styles.pages}>
        <p>Page</p>
        <input
          type="text"
          value={pageNumber}
          onChange={(e) => {
            setPageNumber(e.target.value);
            // check if entered value is a number
            if (isNaN(Number(e.target.value)) || e.target.value === "") return;
            const pageIndex = Number(e.target.value) - 1;
            table.setPageIndex(pageIndex);
          }}
        />
        <p>of {table.getPageCount()}</p>
        <button
          onClick={() => {
            table.previousPage();
            setPageNumber(table.getState().pagination.pageIndex.toString());
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <Image
            src="/icons/arrowLeft.png"
            alt="arrowLeft"
            width={100}
            height={100}
          />
        </button>
        <button
          onClick={() => {
            table.nextPage();
            setPageNumber(
              (table.getState().pagination.pageIndex + 2).toString()
            );
          }}
          disabled={!table.getCanNextPage()}
        >
          <Image
            src="/icons/arrowRight.png"
            alt="arrowRight"
            width={100}
            height={100}
          />
        </button>
      </div>
    </div>
  );
}
