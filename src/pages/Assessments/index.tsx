// import CreateAssessmentPage from "@/features/assessments/pages/CreateAssessmentPage"
// export default CreateAssessmentPage
// "use client";
import { useEffect, useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAssessments } from "./hooks/use-assessments";




import type { Assessment } from "./types/assessment.types";
// import { sileo } from "sileo";
import { StatsCard } from "#components/assessment/stats-card";
import { AssessmentToolbar } from "#components/assessment/assessment-toolbar";
import { AssessmentSkeleton } from "#components/assessment/assessment-skeleton";
import { EmptyState } from "#components/assessment/empty-state";
import { AssessmentTable } from "#components/assessment/assessment-table";
import { AssessmentMobileCard } from "#components/assessment/assessment-mobile-card";
// import PublishAssessmentDialog from "@/features/assessments/components/PublishAssessmentDialog";
import PublishDialog from "#components/assessment/publish-dialog";
import { useOnlyPublishAssessment } from "@/features/assessments/hooks/usePublishAssessment";
import { AssessmentPreviewDialog } from "#components/assessment/assessment-preview-dialog";
import {  useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

export default function AssessmentsPage() {
  const navigate = useNavigate();
  const [publishOpen, setPublishOpen] = useState(false);
  const [previewOpen,setPreviewOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<any>();
  const { mutate: publish } = useOnlyPublishAssessment()
  const { data, isLoading } =
    useAssessments();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  const [page, setPage] =
    useState(1);

  const assessments =
    data?.assessments ?? [];


  console.log(data, "data table assessments", assessments);
  const filteredAssessments =
    useMemo(() => {
      return assessments.filter(
        (assessment) => {
          const matchesSearch =
            assessment.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            status === "ALL"
              ? true
              : assessment.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      assessments,
      search,
      status,
    ]);

  const totalPages =
    Math.ceil(
      filteredAssessments.length /
      ITEMS_PER_PAGE
    ) || 1;

  const paginatedData =
    filteredAssessments.slice(
      (page - 1) *
      ITEMS_PER_PAGE,
      page *
      ITEMS_PER_PAGE
    );

  const handleView = (
    assessment: Assessment
  ) => {
    console.log(
      "view",
      assessment
    );
     setSelectedAssessment(assessment)
    setPreviewOpen(true);
  };

  useEffect(() => {
  if (!publishOpen) {
    document.body.style.pointerEvents = "";
  }
}, [publishOpen]);
  const handlePublish = (
    assessment: Assessment
  ) => {

    console.log(
      "publish",
      assessment
    );

    setSelectedAssessment(assessment)
    setPublishOpen(true);
  };

  const handleConfirmPublish = async () => {
  try {
    await publish(selectedAssessment.id);
  } finally {
    setPublishOpen(false);
    setSelectedAssessment(null);
  }
};

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Assessments
          </h1>

          <p className="text-muted-foreground">
            Manage and publish
            assessments
          </p>
        </div>

        <Button onClick={() => {
          navigate('create')
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      {/* Stats */}

      <StatsCard
        title="Total Assessments"
        value={
          data
            ?.totalAssessments ??
          0
        }
      />

      {/* Filters */}

      <AssessmentToolbar
        search={search}
        status={status}
        onSearchChange={(
          value
        ) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(
          value
        ) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {/* Loading */}

      {isLoading && (
        <AssessmentSkeleton />
      )}

      {/* Empty */}

      {!isLoading &&
        filteredAssessments.length ===
        0 && (
          <EmptyState />
        )}

      {/* Desktop */}

      {!isLoading &&
        filteredAssessments.length >
        0 && (
          <>
            <div className="hidden md:block">
              <AssessmentTable
                assessments={
                  paginatedData
                }
                onView={
                  handleView
                }
                onPublish={
                  handlePublish
                }
              />
            </div>

            {/* Mobile */}

            <div className="grid gap-4 md:hidden">
              {paginatedData.map(
                (
                  assessment
                ) => (
                  <AssessmentMobileCard
                    key={
                      assessment.id
                    }
                    assessment={
                      assessment
                    }
                    onView={
                      handleView
                    }
                    onPublish={
                      handlePublish
                    }
                  />
                )
              )}
            </div>

            {/* Pagination */}

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                disabled={
                  page === 1
                }
                onClick={() =>
                  setPage(
                    (
                      prev
                    ) =>
                      prev -
                      1
                  )
                }
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of{" "}
                {
                  totalPages
                }
              </span>

              <Button
                variant="outline"
                disabled={
                  page ===
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (
                      prev
                    ) =>
                      prev +
                      1
                  )
                }
              >
                Next
              </Button>
            </div>
          </>
        )}

      {/* {selectedAssessment &&     <PublishDialog
      title={selectedAssessment.title}
      onPublish={() => handlePublish}
    />} */}

      <PublishDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={selectedAssessment?.title ?? ""}
        onPublish={() => {
         handleConfirmPublish();
        }}

      />

      <AssessmentPreviewDialog 
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        assessment={selectedAssessment}
      />

      {/* {selectedAssessment && <PublishAssessmentDialog
                          open={publishOpen}
                          onOpenChange={setPublishOpen}
                          config={selectedAssessment}
                          questions={selectedAssessment.questions}
                          assessmentResult={selectedAssessment}
                          title={selectedAssessment.title}
                          instructions={selectedAssessment.instructions}
                          onPublished={() => {
                            // 
                          }}
                        />} */}
    </div>
  );
}