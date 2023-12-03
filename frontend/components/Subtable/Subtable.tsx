"use client";

import React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGet, fetchPost } from "@/utilities/myFetch";

import styles from "./Subtable.module.css";

import Filter from "../Filters/Filter";

export type SubtableData = {
  author: string;
  video: string;
  language: string;
  rating: {
    averageRating: number;
    captionID: string;
  };
  download: string;
}[];

export type SubtableProps = {
  subtitles: {
    author: string;
    video: string;
    language: string;
    rating: {
      averageRating: number;
      captionID: string;
    };
    download: string;
  }[];
  page: "author" | "video";
};

const columns = [
  {
    accessorKey: "author",
    header: "Author",
    cell: (props: any) => (
      <p>
        {<Link href={"/user?u=" + props.getValue()}>{props.getValue()}</Link>}
      </p>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "video",
    header: "Video",
    cell: (props: any) => (
      <p>
        {<Link href={"/video?v=" + props.getValue()}>{props.getValue()}</Link>}
      </p>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: (props: any) => (
      <div className={styles.ratingcell}>
        <p>{props.getValue().averageRating}</p>
        <Stars defaultValue={0} captionID={props.getValue().captionID} />
      </div>
    ),
  },
  {
    accessorKey: "download",
    header: "Download",
    cell: (props: any) => (
      <a href={"http://127.0.0.1:8000/download/" + props.getValue()}>⇓</a>
    ),
    enableSorting: false,
  },
];

export default function Subtable({ subtitles, page }: SubtableProps) {
  const [pageNumber, setPageNumber] = useState("1");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      author: page === "video",
      video: page === "author",
    });
  const table = useReactTable({
    data: subtitles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
      columnVisibility: columnVisibility,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className={styles.subtable}>
      <div className={styles.filters}>
        {page === "video" && (
          <Filter
            filterId="author"
            icon={"/icons/signature.png"}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        )}
        <Filter
          filterId="language"
          icon={"/icons/language.png"}
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

type StarsProps = {
  defaultValue: 0 | 1 | 2 | 3 | 4 | 5;
  captionID: string;
};

function Stars({ defaultValue, captionID }: StarsProps) {
  if (captionID === undefined) return <></>;

  const qc = useQueryClient();

  const ratingQuery = useQuery({
    queryKey: ["rating", captionID],
    queryFn: () =>
      fetchGet("http://127.0.0.1:8000/userRating/" + captionID).then((res) =>
        res.json()
      ),
  });
  const value: number = ratingQuery.isSuccess ? ratingQuery.data : defaultValue;

  const { mutate: setRating } = useMutation({
    mutationKey: ["rating", captionID],
    mutationFn: (ratingValue: number) =>
      fetchPost(
        "http://127.0.0.1:8000/createUserRating/" +
          captionID +
          "/" +
          ratingValue.toString()
      ),
    onMutate: (ratingValue) => {
      qc.setQueryData(["rating", captionID], ratingValue);
    },
    onError: (error) => {
      qc.invalidateQueries({
        queryKey: ["rating", captionID],
      });
    },
  });

  return (
    <div className={styles.starbox}>
      <Star starValue={5} defaultOn={5 <= value} onClick={() => setRating(5)} />
      <Star starValue={4} defaultOn={4 <= value} onClick={() => setRating(4)} />
      <Star starValue={3} defaultOn={3 <= value} onClick={() => setRating(3)} />
      <Star starValue={2} defaultOn={2 <= value} onClick={() => setRating(2)} />
      <Star starValue={1} defaultOn={1 <= value} onClick={() => setRating(1)} />
    </div>
  );
}

type StarProps = {
  starValue: number;
  defaultOn: boolean;
  onClick: (starValue: number) => void;
};

function Star({ starValue, defaultOn, onClick }: StarProps) {
  return (
    <div className={styles.star} onClick={() => onClick(starValue)}>
      <Image src="/icons/star_empty.png" alt="star" width={100} height={100} />
      <Image
        className={defaultOn ? styles.stardefaultvisible : undefined}
        src="/icons/star_filled.png"
        alt="star"
        width={100}
        height={100}
      />
    </div>
  );
}
