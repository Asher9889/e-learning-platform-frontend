// import { ColumnDef } from "@tanstack/react-table";

// import {
//   ArrowUpDown,
//   Eye,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import type { Assessment } from "../types/assessment.types";

// import { StatusBadge } from "./status-badge";

// import { PublishDialog } from "./publish-dialog";

// export const columns: ColumnDef<Assessment>[] =
//   [
//     {
//       accessorKey: "title",

//       header: ({
//         column,
//       }) => (
//         <Button
//           variant="ghost"
//           onClick={() =>
//             column.toggleSorting(
//               column.getIsSorted() ===
//                 "asc"
//             )
//           }
//         >
//           Title

//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },

//     {
//       accessorKey:
//         "assessmentType",

//       header: "Type",
//     },

//     {
//       accessorKey:
//         "difficulty",

//       header: ({
//         column,
//       }) => (
//         <Button
//           variant="ghost"
//           onClick={() =>
//             column.toggleSorting(
//               column.getIsSorted() ===
//                 "asc"
//             )
//           }
//         >
//           Difficulty

//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },

//     {
//       accessorKey:
//         "questionCount",

//       header: ({
//         column,
//       }) => (
//         <Button
//           variant="ghost"
//           onClick={() =>
//             column.toggleSorting(
//               column.getIsSorted() ===
//                 "asc"
//             )
//           }
//         >
//           Questions

//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },

//     {
//       accessorKey:
//         "totalMarks",

//       header: ({
//         column,
//       }) => (
//         <Button
//           variant="ghost"
//           onClick={() =>
//             column.toggleSorting(
//               column.getIsSorted() ===
//                 "asc"
//             )
//           }
//         >
//           Marks

//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },

//     {
//       accessorKey: "status",

//       header: "Status",

//       cell: ({ row }) => (
//         <StatusBadge
//           status={
//             row.original.status
//           }
//         />
//       ),
//     },

//     {
//       id: "actions",

//       header: "Actions",

//       cell: ({ row }) => {
//         const assessment =
//           row.original;

//         return (
//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               variant="outline"
//             >
//               <Eye className="h-4 w-4" />
//             </Button>

//             {assessment.status ===
//               "DRAFT" && (
//               <PublishDialog
//                 title={
//                   assessment.title
//                 }
//                 onPublish={() =>
//                   console.log(
//                     assessment._id
//                   )
//                 }
//               />
//             )}
//           </div>
//         );
//       },
//     },
//   ];