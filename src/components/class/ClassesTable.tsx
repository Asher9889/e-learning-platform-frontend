import { Fragment, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import type { IClass } from "@/constants/user/user.constant";

interface Props {
  data: IClass[];
}

export function ClassesTable({
  data,
}: Props) {
 const [expandedClassId, setExpandedClassId] =
  useState<string | null>(null);

const toggleRow = (id: string) => {
  setExpandedClassId((prev) =>
    prev === id ? null : id
  );
};



  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Sr. No.
            </TableHead>
            <TableHead className="w-[50%]">
              Class
            </TableHead>

            <TableHead>
              Total Sections
            </TableHead>

            <TableHead>
              Total Strength
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center py-8 text-muted-foreground"
              >
                No classes found
              </TableCell>
            </TableRow>
          ) : (
            data.map((cls,index) => (
              <Fragment key={cls.id}>
                {/* Parent Row */}
                <TableRow
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() =>
                    toggleRow(cls.id)
                  }
                >
                     <TableCell>
                    <div className="flex items-center gap-2 font-medium">

                         {expandedClassId === cls.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    {index+1}
                    </div>

                  </TableCell>
                  <TableCell>
                     

                      {cls.className}
                  </TableCell>

                  <TableCell>
                    {cls.sections.length}
                  </TableCell>

                  <TableCell>
                    {cls.strength}
                  </TableCell>
                </TableRow>

                {/* Child Table */}
                {expandedClassId === cls.id && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="bg-muted/20 p-4"
                    >
                      <div className="rounded-md border bg-background">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>
                                Section
                              </TableHead>

                              <TableHead>
                                Strength
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {cls.sections
                              .length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={2}
                                  className="text-center text-muted-foreground"
                                >
                                  No sections
                                  available
                                </TableCell>
                              </TableRow>
                            ) : (
                              cls.sections.map(
                                (
                                  section
                                ) => (
                                  <TableRow
                                    key={
                                      section.id
                                    }
                                  >
                                    <TableCell>
                                      Section{" "}
                                      {
                                        section.sectionName
                                      }
                                    </TableCell>

                                    <TableCell>
                                      {
                                        section.strength
                                      }
                                    </TableCell>
                                  </TableRow>
                                )
                              )
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}